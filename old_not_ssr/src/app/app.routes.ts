import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    },
    {
        path: 'login',
        loadComponent: () => import('../app/pages/login/login.component').then(m => m.LoginComponent)
    },
    {
        path: 'register',
        loadComponent: () => import('../app/pages/register/register.component').then(m => m.RegisterComponent)
    },
    {
        path: '**',
        loadComponent: () => import('../app/pages/not-found/not-found.component').then(m => m.NotFoundComponent)
    }
];