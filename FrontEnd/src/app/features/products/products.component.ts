import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../core/services/product.service';
import { Product } from '../../core/models/pos.models';
import { NotificationService } from '../../shared/toast/notification.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent implements OnInit {
  showForm = false;
  editingProduct = false;
  loading = false;
  saving = false;

  products: Product[] = [];
  currentProduct: Product = { name: '', price: 0, stock: 0 };

  constructor(private productService: ProductService, private notificationService: NotificationService) { }

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.loading = true;
    this.productService.getProducts().subscribe({
      next: (prods) => {
        this.products = prods;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  openForm() {
    this.editingProduct = false;
    this.currentProduct = { name: '', price: 0, stock: 0 };
    this.showForm = true;
  }

  editProduct(product: Product) {
    this.editingProduct = true;
    this.currentProduct = { ...product };
    this.showForm = true;
  }

  closeForm() {
    this.showForm = false;
  }

  saveProduct() {
    if (this.currentProduct.name && this.currentProduct.price >= 0) {
      this.saving = true;
      if (this.editingProduct) {
        this.productService.updateProduct(this.currentProduct._id!, this.currentProduct).subscribe({
          next: () => this.handleSuccess('Producto actualizado'),
          error: () => this.handleError()
        });
      } else {
        this.productService.createProduct(this.currentProduct).subscribe({
          next: () => this.handleSuccess('Producto creado'),
          error: () => this.handleError()
        });
      }
    }
  }

  private handleSuccess(msg: string) {
    this.saving = false;
    this.closeForm();
    this.loadProducts();
    this.notificationService.success(msg);
  }

  private handleError() {
    this.saving = false;
    this.notificationService.error('Error al procesar la solicitud.');
  }

  confirmDelete(id: string) {
    if (confirm('¿Estás seguro de eliminar este producto?')) {
      this.productService.deleteProduct(id).subscribe({
        next: () => {
          this.loadProducts();
          this.notificationService.success('Producto eliminado');
        },
        error: () => this.notificationService.error('Error al eliminar producto')
      });
    }
  }
}
