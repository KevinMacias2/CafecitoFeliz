import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CustomerService } from '../../core/services/customer.service';
import { Customer } from '../../core/models/pos.models';

@Component({
    selector: 'app-customers',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './customers.component.html',
    styleUrl: './customers.component.css'
})
export class CustomersComponent implements OnInit {
    showForm = false;
    searchQuery = '';
    newCustomer: Customer = { name: '', phoneOrEmail: '' };

    customers: Customer[] = [];
    loading = false;
    saving = false;

    constructor(private customerService: CustomerService) { }

    get filteredCustomers() {
        return this.customers.filter(c =>
            c.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
            c.phoneOrEmail.toLowerCase().includes(this.searchQuery.toLowerCase())
        );
    }

    ngOnInit() {
        this.loadCustomers();
    }

    loadCustomers() {
        this.loading = true;
        this.customerService.getCustomers().subscribe({
            next: (custs) => {
                this.customers = custs;
                this.loading = false;
            },
            error: () => this.loading = false
        });
    }

    saveCustomer() {
        if (this.newCustomer.name && this.newCustomer.phoneOrEmail) {
            this.saving = true;
            this.customerService.createCustomer(this.newCustomer).subscribe({
                next: () => {
                    this.saving = false;
                    this.showForm = false;
                    this.newCustomer = { name: '', phoneOrEmail: '' };
                    this.loadCustomers();
                    alert('Cliente registrado con éxito!');
                },
                error: () => {
                    this.saving = false;
                    alert('Error al registrar cliente. El contacto podría estar duplicado.');
                }
            });
        }
    }
}
