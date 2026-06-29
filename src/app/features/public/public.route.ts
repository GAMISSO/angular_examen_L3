import { Routes } from '@angular/router';
import { Public } from './public';

export const PUBLIC_ROUTE: Routes = [
    {
        path: '',
        component: Public,
        children: [
            { path: '', redirectTo: 'login', pathMatch: 'full' },
            {
                path: 'login',
                loadComponent: () => import('./public-login/public-login').then((m) => m.PublicLogin),
            },
        ],
    },
];