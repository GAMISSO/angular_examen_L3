import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
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
    protected readonly registering = signal(false);
    protected readonly feedback = signal<string | null>(null);
    protected readonly errorMessage = signal<string | null>(null);
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

    protected async submit(): Promise<void> {
        this.loginForm.markAllAsTouched();
        this.feedback.set(null);
        this.errorMessage.set(null);

        if (this.loginForm.invalid || this.submitting()) {
            return;
        }

        this.submitting.set(true);
        const { email, password } = this.loginForm.getRawValue();
        try {
            const response = await firstValueFrom(this.authApi.login({ email, password }));
            const session = this.sessionService.login({ email, password }, response);

            this.feedback.set('Connexion réussie. Redirection en cours.');
            void this.router.navigateByUrl(session.role === 'agent-guichet' ? '/private/agent' : '/private/client');
        } catch {
            this.errorMessage.set('Connexion impossible pour le moment. Vérifiez le backend ou utilisez la connexion démo.');
        } finally {
            this.submitting.set(false);
        }
    }

    protected demoConnect(): void {
        const { email, password } = this.loginForm.getRawValue();
        const session = this.sessionService.login({ email, password });

        void this.router.navigateByUrl(session.role === 'agent-guichet' ? '/private/agent' : '/private/client');
    }

    protected async createClientAccount(): Promise<void> {
        this.createClientForm.markAllAsTouched();
        this.feedback.set(null);
        this.errorMessage.set(null);

        if (this.createClientForm.invalid || this.registering()) {
            return;
        }

        this.registering.set(true);
        const payload = this.createClientForm.getRawValue();

        try {
            await firstValueFrom(this.authApi.registerClient(payload));
            this.feedback.set('Compte client créé avec succès. Vous pouvez maintenant vous connecter.');
            this.createClientForm.reset();
        } catch {
            this.errorMessage.set('Création du compte impossible pour le moment. Vérifiez le backend.');
        } finally {
            this.registering.set(false);
        }
    }
}