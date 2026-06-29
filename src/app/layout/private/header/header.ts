import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { SessionService } from '../../../core/services/session.service';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  private readonly sessionService = inject(SessionService);

  protected readonly session = this.sessionService.session;
  protected readonly roleLabel = this.sessionService.roleLabel;
  protected readonly userLabel = computed(() => this.session()?.displayName ?? 'Visiteur');

  protected logout(): void {
    this.sessionService.logout();
  }
}
