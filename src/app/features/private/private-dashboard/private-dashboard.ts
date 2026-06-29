import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { SessionService } from '../../../core/services/session.service';
import { WalletApiService, WalletFacture, WalletSummary, WalletTransaction } from '../../../core/services/wallet-api.service';

@Component({
    selector: 'app-private-dashboard',
    imports: [RouterLink],
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './private-dashboard.html',
    styleUrl: './private-dashboard.css',
})
export class PrivateDashboard {
    private readonly walletApi = inject(WalletApiService);
    protected readonly sessionService = inject(SessionService);
    protected readonly loading = signal(false);
    protected readonly error = signal<string | null>(null);
    protected readonly wallets = signal<WalletSummary[]>([]);
    protected readonly selectedPhone = signal<string | null>(null);
    protected readonly selectedWallet = computed(() => {
        const selectedPhone = this.selectedPhone();

        return this.wallets().find((wallet) => wallet.phoneNumber === selectedPhone) ?? this.wallets()[0] ?? null;
    });
    protected readonly balance = signal<number | null>(null);
    protected readonly transactions = signal<WalletTransaction[]>([]);
    protected readonly currentFactures = signal<WalletFacture[]>([]);

    constructor() {
        void this.refresh();
    }

    protected async refresh(): Promise<void> {
        this.loading.set(true);
        this.error.set(null);

        try {
            const response = await firstValueFrom(this.walletApi.listWallets(0, 6));
            const wallets = Array.isArray(response) ? response : response.content ?? [];

            this.wallets.set(wallets);

            const selectedWallet = wallets.find((wallet) => Boolean(wallet.phoneNumber)) ?? wallets[0] ?? null;
            this.selectedPhone.set(selectedWallet?.phoneNumber ?? null);

            if (selectedWallet?.phoneNumber) {
                await this.loadWallet(selectedWallet);
            } else {
                this.balance.set(null);
                this.transactions.set([]);
                this.currentFactures.set([]);
            }
        } catch {
            this.error.set('Impossible de charger les wallets depuis le backend.');
        } finally {
            this.loading.set(false);
        }
    }

    protected async selectWallet(wallet: WalletSummary): Promise<void> {
        if (!wallet.phoneNumber) {
            return;
        }

        this.selectedPhone.set(wallet.phoneNumber);
        await this.loadWallet(wallet);
    }

    private async loadWallet(wallet: WalletSummary): Promise<void> {
        if (!wallet.phoneNumber) {
            return;
        }

        try {
            const [balanceResponse, transactionsResponse, factsResponse] = await Promise.all([
                firstValueFrom(this.walletApi.getWalletBalance(wallet.phoneNumber)),
                firstValueFrom(this.walletApi.getTransactions(wallet.phoneNumber)),
                wallet.code ? firstValueFrom(this.walletApi.getCurrentFactures(wallet.code)) : Promise.resolve([] as WalletFacture[]),
            ]);

            this.balance.set(balanceResponse.balance ?? balanceResponse.amount ?? wallet.balance ?? null);
            this.transactions.set(transactionsResponse ?? []);

            const factures = Array.isArray(factsResponse) ? factsResponse : factsResponse.content ?? [];
            this.currentFactures.set(factures);
        } catch {
            this.balance.set(wallet.balance ?? null);
            this.transactions.set([]);
            this.currentFactures.set([]);
        }
    }
}