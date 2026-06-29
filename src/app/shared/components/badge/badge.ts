import { Component, Input } from '@angular/core';
import { StatutDemandeModel } from '../../../features/private/models/demande.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-badge',
  imports: [CommonModule],
  template: `
    <ng-container>
      @switch (statut) {
        @case ("Acceptée") { <span  class="badge badge-success"><i class="bi bi-check-circle"></i>{{ statut }}</span>}
          @case ("Refusée") {
          <span class="badge badge-danger"><i class="bi bi-x-circle"></i>{{ statut }}</span>
          }
          @case ("En Attente") {
          <span  class="badge badge-warning text-dark"><i class="bi bi-hourglass-split"></i>{{ statut }}</span>
          }
          @default {
          <span  class="badge badge-secondary">{{ statut }}</span>
          }
          
      }
    </ng-container>
  `

})
export class Badge {
  @Input() statut: StatutDemandeModel = 'En Attente'
}