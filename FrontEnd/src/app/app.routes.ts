import { Routes } from '@angular/router';
import { SkeletonComponent } from './shared/skeleton/skeleton.component';

export const routes: Routes = [
    {
        path: '',
        component: SkeletonComponent,
        children: [
            { path: '', redirectTo: 'sales', pathMatch: 'full' },
            { path: 'sales', loadComponent: () => import('./features/sales/sales.component').then(m => m.SalesComponent) },
            { path: 'customers', loadComponent: () => import('./features/customers/customers.component').then(m => m.CustomersComponent) },
            { path: 'products', loadComponent: () => import('./features/products/products.component').then(m => m.ProductsComponent) },
        ]
    },
    { path: '**', redirectTo: '' }
];
