import { Routes } from '@angular/router';
import { Private } from './private';

export const PRIVATE_ROUTE: Routes = [
    {
        path: '',
        component: Private,
        children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
            {
                path: 'dashboard',
                loadComponent: () => import('./private-dashboard/private-dashboard').then((m) => m.PrivateDashboard),
            },
            {
                path: 'client',
                loadComponent: () => import('../client/client').then((m) => m.Client),
            },
            {
                path: 'agent',
                loadComponent: () => import('../agent-guichet/agent-guichet').then((m) => m.AgentGuichet),
            },
        ],
    },
];