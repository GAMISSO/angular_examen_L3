import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface WalletSummary {
    id?: number | string;
    code?: string;
    phoneNumber?: string;
    email?: string;
    fullName?: string;
    ownerName?: string;
    currency?: string;
    balance?: number;
    availableBalance?: number;
    status?: string;
}

export interface WalletDetail extends WalletSummary {
    createdAt?: string;
    updatedAt?: string;
}

export interface WalletPageResponse {
    content?: WalletSummary[];
    totalElements?: number;
    totalPages?: number;
    size?: number;
    number?: number;
}

export interface WalletCreateRequest {
    phoneNumber: string;
    email: string;
    initialBalance: number;
    code: string;
    currency: string;
}

export interface WalletSeedResult {
    message?: string;
    created?: number;
    wallets?: number;
}

export interface WalletDepositRequest {
    amount: number;
    paymentMethod: 'CREDIT_CARD' | 'WALLET_TARGET' | string;
}

export interface WalletWithdrawRequest {
    phoneNumber: string;
    amount: number;
}

export interface WalletTransferRequest {
    senderPhone: string;
    receiverPhone: string;
    amount: number;
}

export interface WalletPayRequest {
    phoneNumber: string;
    serviceName: string;
    amount: number;
}

export interface WalletPayFacturesRequest {
    phoneNumber: string;
    serviceName: string;
    factureReferences: string[];
}

export interface WalletTransaction {
    id?: number | string;
    type?: string;
    amount?: number;
    fee?: number;
    currency?: string;
    description?: string;
    status?: string;
    createdAt?: string;
    phoneNumber?: string;
}

export interface WalletFacture {
    reference?: string;
    serviceName?: string;
    amount?: number;
    currency?: string;
    unite?: string;
    status?: string;
    dueDate?: string;
}

@Injectable({ providedIn: 'root' })
export class WalletApiService {
    private readonly http = inject(HttpClient);
    private readonly baseUrl = environment.walletApiBaseUrl;

    seedWallets(numWallets = 10, eventsPerWallet = 100): Observable<WalletSeedResult> {
        return this.http.post<WalletSeedResult>(
            `${this.baseUrl}/api/wallets/seed?numWallets=${numWallets}&eventsPerWallet=${eventsPerWallet}`,
            {},
        );
    }

    createWallet(payload: WalletCreateRequest): Observable<WalletSummary> {
        return this.http.post<WalletSummary>(`${this.baseUrl}/api/wallets`, payload);
    }

    listWallets(page = 0, size = 10): Observable<WalletPageResponse | WalletSummary[]> {
        return this.http.get<WalletPageResponse | WalletSummary[]>(`${this.baseUrl}/api/wallets?page=${page}&size=${size}`);
    }

    getWalletByPhone(phoneNumber: string): Observable<WalletDetail> {
        return this.http.get<WalletDetail>(`${this.baseUrl}/api/wallets/${encodeURIComponent(phoneNumber)}`);
    }

    getWalletBalance(phoneNumber: string): Observable<{ balance?: number; amount?: number; currency?: string }> {
        return this.http.get<{ balance?: number; amount?: number; currency?: string }>(
            `${this.baseUrl}/api/wallets/${encodeURIComponent(phoneNumber)}/balance`,
        );
    }

    deposit(walletId: number | string, payload: WalletDepositRequest): Observable<unknown> {
        return this.http.post(`${this.baseUrl}/api/wallets/${encodeURIComponent(String(walletId))}/deposit`, payload);
    }

    withdraw(payload: WalletWithdrawRequest): Observable<unknown> {
        return this.http.post(`${this.baseUrl}/api/wallets/withdraw`, payload);
    }

    transfer(payload: WalletTransferRequest): Observable<unknown> {
        return this.http.post(`${this.baseUrl}/api/wallets/transfer`, payload);
    }

    pay(payload: WalletPayRequest): Observable<unknown> {
        return this.http.post(`${this.baseUrl}/api/wallets/pay`, payload);
    }

    payFactures(payload: WalletPayFacturesRequest): Observable<unknown> {
        return this.http.post(`${this.baseUrl}/api/wallets/pay-factures`, payload);
    }

    getTransactions(phoneNumber: string): Observable<WalletTransaction[]> {
        return this.http.get<WalletTransaction[]>(`${this.baseUrl}/api/wallets/${encodeURIComponent(phoneNumber)}/transactions`);
    }

    getCurrentFactures(walletCode: string, unite?: string): Observable<WalletFacture[] | { content?: WalletFacture[] }> {
        const params = unite ? `?unite=${encodeURIComponent(unite)}` : '';

        return this.http.get<WalletFacture[] | { content?: WalletFacture[] }>(
            `${this.baseUrl}/api/external/factures/${encodeURIComponent(walletCode)}/current${params}`,
        );
    }

    getFacturesByPeriod(walletCode: string, debut: string, fin: string): Observable<WalletFacture[] | { content?: WalletFacture[] }> {
        return this.http.get<WalletFacture[] | { content?: WalletFacture[] }>(
            `${this.baseUrl}/api/external/factures/${encodeURIComponent(walletCode)}/periode?debut=${encodeURIComponent(debut)}&fin=${encodeURIComponent(fin)}`,
        );
    }
}