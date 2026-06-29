import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SessionService } from '../../../core/services/session.service';

@Component({
    selector: 'app-public-login',
    imports: [ReactiveFormsModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './public-login.html',
    styleUrl: './public-login.css',
})
export class PublicLogin {
    private readonly formBuilder = inject(FormBuilder);
    private readonly sessionService = inject(SessionService);
    private readonly router = inject(Router);

    protected readonly submitting = signal(false);
    protected readonly role = signal<'client' | 'agent-guichet'>('client');
    protected readonly loginForm = this.formBuilder.nonNullable.group({
        displayName: ['Amina Diallo', [Validators.required, Validators.minLength(3)]],
        role: ['client' as 'client' | 'agent-guichet', [Validators.required]],
    });

    protected readonly isInvalid = computed(() => this.loginForm.invalid && this.loginForm.touched);

    protected setRole(value: 'client' | 'agent-guichet'): void {
        this.role.set(value);
        this.loginForm.controls.role.setValue(value);
    }

    protected submit(): void {
        this.loginForm.markAllAsTouched();

        if (this.loginForm.invalid || this.submitting()) {
            return;
        }

        this.submitting.set(true);
        const { role, displayName } = this.loginForm.getRawValue();
        this.sessionService.login({
            email: `${displayName.toLowerCase().replace(/\s+/g, '.')}@badwallet.tn`,
            password: 'demo',
            role,
        });

        void this.router.navigate(['/private/dashboard']);
    }

    protected demoLogin(value: 'client' | 'agent-guichet'): void {
        this.sessionService.demoLogin(value);
        void this.router.navigate(['/private/dashboard']);
    }
}