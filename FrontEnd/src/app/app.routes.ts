import { Routes } from '@angular/router';
import { SkeletonComponent } from './shared/skeleton/skeleton.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    {
        path: 'login',
        loadComponent: () => import('./features/login/login.component').then(m => m.LoginComponent)
    },
    {
        path: '',
        component: SkeletonComponent,
        canActivate: [authGuard],
        children: [
            { path: '', redirectTo: 'sales', pathMatch: 'full' },
            { path: 'sales', loadComponent: () => import('./features/sales/sales.component').then(m => m.SalesComponent) },
            { path: 'customers', loadComponent: () => import('./features/customers/customers.component').then(m => m.CustomersComponent) },
            { path: 'products', loadComponent: () => import('./features/products/products.component').then(m => m.ProductsComponent) },
        ]
    },
    { path: '**', redirectTo: '' }
];
