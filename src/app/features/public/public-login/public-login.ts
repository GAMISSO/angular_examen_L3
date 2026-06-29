import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthApiService } from '../../../core/services/auth-api.service';
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
    private readonly authApi = inject(AuthApiService);
    private readonly sessionService = inject(SessionService);
    private readonly router = inject(Router);

    protected readonly submitting = signal(false);
    protected readonly creatingAccount = signal(false);
    protected readonly loginForm = this.formBuilder.nonNullable.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(4)]],
    });
    protected readonly createClientForm = this.formBuilder.nonNullable.group({
        fullName: ['', [Validators.required, Validators.minLength(3)]],
        email: ['', [Validators.required, Validators.email]],
        phone: ['', [Validators.required, Validators.pattern(/^\+?[0-9]{8,15}$/)]],
        password: ['', [Validators.required, Validators.minLength(4)]],
    });

    protected submit(): void {
        this.loginForm.markAllAsTouched();

        if (this.loginForm.invalid || this.submitting()) {
            return;
        }

        this.submitting.set(true);
        const { email, password } = this.loginForm.getRawValue();
        const session = this.sessionService.login({ email, password });

        void this.router.navigateByUrl(session.role === 'agent-guichet' ? '/private/agent' : '/private/client');
    }

    protected createClientAccount(): void {
        this.createClientForm.markAllAsTouched();

        if (this.createClientForm.invalid || this.creatingAccount()) {
            return;
        }

        this.creatingAccount.set(true);
        const payload = this.createClientForm.getRawValue();

        this.authApi.registerClient(payload).subscribe({
            next: () => {
                this.creatingAccount.set(false);
                this.createClientForm.reset();
            },
            error: () => {
                this.creatingAccount.set(false);
            },
        });
    }
}