import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  imports: [CommonModule],
  template: `
    @if (pages.length > 0) {
      <nav class="d-flex justify-content-center mt-3">
        <ul class="pagination mb-0">
          <li class="page-item" [class.disabled]="desactivePrecedent">
            <button class="page-link" type="button" (click)="onPageChange(currentPage - 1)">Précédent</button>
          </li>

          @for (page of pages; track page) {
            <li class="page-item" [class.active]="page === currentPage">
              <button class="page-link" type="button" (click)="onPageChange(page)">{{ page }}</button>
            </li>
          }

          <li class="page-item" [class.disabled]="desactiveSuivant">
            <button class="page-link" type="button" (click)="onPageChange(currentPage + 1)">Suivant</button>
          </li>
        </ul>
      </nav>
    }
  `,
  styles: []
})
export class PaginationComponent {
  @Input({ required: true }) pages: number[] = [];
  @Input() currentPage = 1;
  @Input() totalPage = 1;

  @Output() pageChange = new EventEmitter<number>();

  get desactivePrecedent(): boolean {
    return this.currentPage <= 1;
  }

  get desactiveSuivant(): boolean {
    return this.currentPage >= this.totalPage;
  }

  onPageChange(page: number): void {
    if (page < 1 || page > this.totalPage || page === this.currentPage) {
      return;
    }

    this.pageChange.emit(page);
  }

}