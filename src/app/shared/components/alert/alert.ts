import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-alert',
  imports: [],
  template: `<div class="alert alert-{{ type }}" role="alert">
                        <strong>{{ message }}</strong>
                    </div>`,
  styles: []
})
export class Alert {
  @Input({required: true}) message:string=''
  @Input() type:'success' | 'danger' | 'warning' | 'info' = 'info'
}