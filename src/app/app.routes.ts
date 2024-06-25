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
        path: 'salas',
        loadComponent: () => import('../app/pages/salas/salas.component').then(m => m.SalasComponent)
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
