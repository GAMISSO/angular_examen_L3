import { Routes } from '@angular/router';
import { isConnectGuard } from './core/guards/is-connect-guard';
import { isConnectChildGuard } from './core/guards/is-connect-child-guard';


export const routes: Routes = [
    
    {
        path: 'private',
        canActivate: [isConnectGuard],
        canActivateChild: [isConnectChildGuard],
        loadChildren:()=> import('./features/private/private.route').then(m=>m.PRIVATE_ROUTE)
    },
    {
        path: 'public',
        loadChildren:()=> import('./features/public/public.route').then(m=>m.PUBLIC_ROUTE)
    },

        {path: '', redirectTo: '/public', pathMatch: 'full' },
        {path:'**', redirectTo: '/public/login' }
];