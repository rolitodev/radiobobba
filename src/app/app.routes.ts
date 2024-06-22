import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'inicio',
        pathMatch: 'full'
    },
    {
        path: 'inicio',
        loadComponent: () => import('../app/pages/home/home.component').then(m => m.HomeComponent)
    },
    {
        path: 'equipo',
        loadComponent: () => import('../app/pages/equipo/equipo.component').then(m => m.EquipoComponent)
    },
    {
        path: 'alianzas',
        loadComponent: () => import('../app/pages/alianzas/alianzas.component').then(m => m.AlianzasComponent)
    },
    {
        path: 'dj',
        loadComponent: () => import('../app/pages/dj/dj.component').then(m => m.DjComponent),
        canActivate: [AuthGuard]
    },
    {
        path: '**',
        redirectTo: 'inicio'
    }
];
