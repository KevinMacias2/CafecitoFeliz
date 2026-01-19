import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../core/services/product.service';
import { CustomerService } from '../../core/services/customer.service';
import { SaleService } from '../../core/services/sale.service';
import { Product, Customer, Sale, SaleItem } from '../../core/models/pos.models';
import { NotificationService } from '../../shared/toast/notification.service';

interface CartItem {
  product: Product;
  quantity: number;
}

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-sales',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sales.component.html',
  styleUrl: './sales.component.css'
})
export class SalesComponent implements OnInit {
  // ... existing properties ...
  searchQuery: string = '';
  products: Product[] = [];
  customers: Customer[] = [];

  cart: CartItem[] = [];
  selectedCustomerId: string | null = null;
  discountPercent: number = 0;

  loading = false;
  processingSale = false;
  showTicket = false;
  lastSale: Sale | null = null;

  constructor(
    private productService: ProductService,
    private customerService: CustomerService,
    private saleService: SaleService,
    private notificationService: NotificationService
  ) { }

  // ... existing getters and methods ...

  get filteredProducts() {
    return this.products.filter(p =>
      p.name.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  get subtotal() {
    return this.cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  }

  get discountAmount() {
    return this.subtotal * (this.discountPercent / 100);
  }

  get total() {
    return this.subtotal - this.discountAmount;
  }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loading = true;
    this.productService.getProducts().subscribe({
      next: (prods) => {
        this.products = prods;
        this.loading = false;
      },
      error: () => this.loading = false
    });

    this.customerService.getCustomers().subscribe(custs => {
      this.customers = custs;
    });
  }

  onCustomerChange() {
    if (!this.selectedCustomerId) {
      this.discountPercent = 0;
      return;
    }
    const customer = this.customers.find(c => c._id === this.selectedCustomerId);
    if (customer && customer.purchasesCount && customer.purchasesCount >= 5) {
      this.discountPercent = 10;
    } else {
      this.discountPercent = 0;
    }
  }

  addToCart(product: Product) {
    const existing = this.cart.find(item => item.product._id === product._id);
    if (existing) {
      existing.quantity++;
    } else {
      this.cart.push({ product, quantity: 1 });
    }
  }

  updateQuantity(item: CartItem, delta: number) {
    item.quantity += delta;
    if (item.quantity <= 0) {
      this.cart = this.cart.filter(i => i.product._id !== item.product._id);
    }
  }

  clearCart() {
    this.cart = [];
    this.selectedCustomerId = null;
    this.discountPercent = 0;
  }

  checkout() {
    if (this.cart.length === 0) return;

    this.processingSale = true;
    const salePayload: any = {
      customerId: this.selectedCustomerId,
      items: this.cart.map(item => ({
        productId: item.product._id!,
        productNameSnapshot: item.product.name,
        quantity: item.quantity
      })),
      subtotal: this.subtotal,
      discountPercent: this.discountPercent,
      discountAmount: this.discountAmount,
      total: this.total,
      paymentMethod: 'cash'
    };

    this.saleService.createSale(salePayload).subscribe({
      next: (registeredSale) => {
        this.lastSale = registeredSale;
        this.showTicket = true;
        this.processingSale = false;
        this.clearCart();
        this.loadData();
        this.notificationService.success('Venta registrada con éxito');
      },
      error: (err) => {
        console.error(err);
        const msg = err.error?.msg || 'Error al registrar la venta. Intente nuevamente.';
        this.notificationService.error(msg);
        this.processingSale = false;
      }
    });
  }

  closeTicket() {
    this.showTicket = false;
    this.lastSale = null;
  }

  downloadTicket() {
    const data = document.getElementById('ticketContent');
    if (data) {
      html2canvas(data, { scale: 2 }).then(canvas => {
        const imgWidth = 80; // Small receipt width (mm)
        const pageHeight = 295;
        const imgHeight = canvas.height * imgWidth / canvas.width;

        const contentDataURL = canvas.toDataURL('image/png');
        // 'p', 'mm', [width, height] - Custom small format
        const pdf = new jsPDF('p', 'mm', [imgWidth, imgHeight + 10]); // +10 margin
        const position = 0;
        pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
        pdf.save(`Voucher-${this.lastSale?._id?.slice(-6)}.pdf`);
      });
    }
  }
}
