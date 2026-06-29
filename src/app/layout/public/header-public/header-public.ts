import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-header-public',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './header-public.html',
  styleUrl: './header-public.css',
})
export class HeaderPublic {

}
