import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from '../../layout/private/header/header';

@Component({
  selector: 'app-private',
  imports: [Header, RouterOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './private.html',
  styleUrl: './private.css',
})
export class Private {
}
