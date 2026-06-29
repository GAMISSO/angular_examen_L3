import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SessionService } from '../../../core/services/session.service';

@Component({
    selector: 'app-private-dashboard',
    imports: [RouterLink],
    templateUrl: './private-dashboard.html',
    styleUrl: './private-dashboard.css',
})
export class PrivateDashboard {
    protected readonly sessionService = inject(SessionService);
}