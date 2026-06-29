import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderPublic } from '../../layout/public/header-public/header-public';

@Component({
  selector: 'app-public',
  standalone: true,
  imports: [HeaderPublic, RouterOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './public.html',
  styleUrl: './public.css',
})
export class Public {
}
