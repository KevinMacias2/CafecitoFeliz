import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CustomerService } from '../../core/services/customer.service';
import { Customer } from '../../core/models/pos.models';

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="clients-container fade-in">
      <div class="header">
        <h1 class="brand-font">Gestión de Clientes</h1>
        <button class="btn-primary" (click)="showForm = !showForm">
          {{ showForm ? 'Ver Listado' : '+ Nuevo Cliente' }}
        </button>
      </div>

      @if (showForm) {
        <div class="form-card fade-in">
          <h2 class="brand-font">Registrar Cliente</h2>
          <form (ngSubmit)="saveCustomer()">
            <div class="form-group">
              <label>Nombre Completo</label>
              <input type="text" [(ngModel)]="newCustomer.name" name="name" required placeholder="Ej: Juan Pérez">
            </div>
            <div class="form-group">
              <label>Teléfono o Correo</label>
              <input type="text" [(ngModel)]="newCustomer.phoneOrEmail" name="phoneOrEmail" required placeholder="Ej: 555-0123 o juan@mail.com">
            </div>
            <div class="form-actions">
              <button type="submit" class="btn-primary" [disabled]="saving">
                {{ saving ? 'Guardando...' : 'Guardar Cliente' }}
              </button>
              <button type="button" class="btn-outline" (click)="showForm = false">Cancelar</button>
            </div>
          </form>
        </div>
      } @else {
        <div class="list-section fade-in">
          <div class="search-bar">
            <span class="search-icon">🔍</span>
            <input type="text" [(ngModel)]="searchQuery" placeholder="Buscar por nombre, teléfono o correo..." class="search-input">
          </div>

          <div class="table-container">
            <table class="clients-table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Contacto</th>
                  <th>Compras</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                @for (customer of filteredCustomers; track customer._id) {
                  <tr>
                    <td>{{ customer.name }}</td>
                    <td>{{ customer.phoneOrEmail }}</td>
                    <td>{{ customer.purchasesCount }}</td>
                    <td>
                      <span class="badge" [class.recurring]="customer.purchasesCount && customer.purchasesCount >= 5">
                        {{ customer.purchasesCount && customer.purchasesCount >= 5 ? 'Recurrente' : 'Nuevo' }}
                      </span>
                    </td>
                  </tr>
                } @empty {
                  <tr>
                    <td colspan="4" class="empty-msg">
                      {{ loading ? 'Cargando clientes...' : 'No se encontraron clientes.' }}
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .clients-container { display: flex; flex-direction: column; gap: 2rem; }
    .header { display: flex; justify-content: space-between; align-items: center; }
    .form-card { background: white; padding: 2rem; border-radius: var(--radius-lg); box-shadow: var(--shadow-md); max-width: 500px; }
    .form-group { margin-bottom: 1.5rem; display: flex; flex-direction: column; gap: 0.5rem; }
    .form-group label { font-weight: 600; color: var(--text-dark); }
    .form-group input { padding: 0.85rem; border: 1px solid var(--border-light); border-radius: var(--radius-md); outline: none; }
    .form-actions { display: flex; gap: 1rem; margin-top: 1rem; }
    .search-bar { position: relative; }
    .search-icon { position: absolute; left: 1rem; top: 50%; transform: translateY(-50%); color: var(--text-muted); }
    .search-input { width: 100%; padding: 0.85rem 1rem 0.85rem 3rem; border: 1px solid var(--border-light); border-radius: var(--radius-lg); font-size: 1rem; }
    .table-container { background: white; padding: 1rem; border-radius: var(--radius-lg); box-shadow: var(--shadow-sm); overflow-x: auto; }
    .clients-table { width: 100%; border-collapse: collapse; text-align: left; }
    .clients-table th { padding: 1rem; border-bottom: 2px solid var(--accent-green-light); color: var(--text-muted); font-weight: 600; }
    .clients-table td { padding: 1rem; border-bottom: 1px solid var(--border-light); }
    .badge { padding: 0.25rem 0.65rem; border-radius: 20px; font-size: 0.8rem; font-weight: 600; background: #f3f4f6; color: #6b7280; }
    .badge.recurring { background: var(--accent-green-light); color: var(--secondary-green); }
    .empty-msg { text-align: center; padding: 3rem; color: var(--text-muted); }
  `]
})
export class ClientsComponent implements OnInit {
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
