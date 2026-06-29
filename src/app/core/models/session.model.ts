export type UserRole = 'client' | 'agent-guichet';

export interface SessionUser {
    email: string;
    displayName: string;
    role: UserRole;
    token?: string;
}

export interface LoginCredentials {
    email: string;
    password: string;
}