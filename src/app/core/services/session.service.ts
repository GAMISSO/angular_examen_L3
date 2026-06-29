import { Injectable, computed, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { LoginCredentials, SessionUser } from '../models/session.model';

@Injectable({
    providedIn: 'root',
})
export class SessionService {
    private readonly platformId = inject(PLATFORM_ID);
    private readonly storageKey = 'badwallet-session';
    private readonly sessionState = signal<SessionUser | null>(this.readSession());

    readonly session = this.sessionState.asReadonly();
    readonly isAuthenticated = computed(() => this.sessionState() !== null);
    readonly roleLabel = computed(() => {
        const role = this.sessionState()?.role;

        if (role === 'agent-guichet') {
            return 'Agent guichet';
        }

        if (role === 'client') {
            return 'Client';
        }

        return 'Visiteur';
    });

    login(credentials: LoginCredentials, sessionData?: Partial<SessionUser>): SessionUser {
        const role = sessionData?.role ?? this.inferRole(credentials.email);
        const email = sessionData?.email?.trim() || credentials.email.trim();
        const session: SessionUser = {
            email,
            displayName: sessionData?.displayName ?? this.buildDisplayName(email, role),
            role,
            token: sessionData?.token,
        };

        return this.setSession(session);
    }

    setSession(session: SessionUser): SessionUser {
        this.sessionState.set(session);
        this.persistSession(session);

        return session;
    }

    logout(): void {
        this.sessionState.set(null);
        this.clearSession();
    }

    private inferRole(email: string): SessionUser['role'] {
        const normalizedEmail = email.toLowerCase();

        if (normalizedEmail.includes('agent') || normalizedEmail.includes('admin') || normalizedEmail.includes('guichet')) {
            return 'agent-guichet';
        }

        return 'client';
    }

    private buildDisplayName(email: string, role: SessionUser['role']): string {
        const prefix = role === 'agent-guichet' ? 'Agence' : 'Client';
        const name = email.split('@')[0]?.replace(/[._-]+/g, ' ') ?? prefix;

        return `${prefix} ${name}`.trim();
    }

    private readSession(): SessionUser | null {
        if (!isPlatformBrowser(this.platformId)) {
            return null;
        }

        const rawSession = localStorage.getItem(this.storageKey);

        if (!rawSession) {
            return null;
        }

        try {
            return JSON.parse(rawSession) as SessionUser;
        } catch {
            localStorage.removeItem(this.storageKey);
            return null;
        }
    }

    private persistSession(session: SessionUser): void {
        if (!isPlatformBrowser(this.platformId)) {
            return;
        }

        localStorage.setItem(this.storageKey, JSON.stringify(session));
    }

    private clearSession(): void {
        if (!isPlatformBrowser(this.platformId)) {
            return;
        }

        localStorage.removeItem(this.storageKey);
    }
}