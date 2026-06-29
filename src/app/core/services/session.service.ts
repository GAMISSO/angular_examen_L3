import { Injectable, computed, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { LoginCredentials, SessionUser, UserRole } from '../models/session.model';

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

  login(credentials: LoginCredentials): SessionUser {
    const session: SessionUser = {
      email: credentials.email.trim(),
      displayName: this.buildDisplayName(credentials.email, credentials.role),
      role: credentials.role,
    };

    this.sessionState.set(session);
    this.persistSession(session);

    return session;
  }

  demoLogin(role: UserRole): SessionUser {
    return this.login({
      email: role === 'client' ? 'client@badwallet.tn' : 'agent@badwallet.tn',
      password: 'demo',
      role,
    });
  }

  logout(): void {
    this.sessionState.set(null);
    this.clearSession();
  }

  private buildDisplayName(email: string, role: UserRole): string {
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