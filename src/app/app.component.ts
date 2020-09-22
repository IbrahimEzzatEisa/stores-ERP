import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <router-outlet></router-outlet>
    <notifier-container></notifier-container>
    <ngx-spinner
  bdColor="rgba(51,51,51,0.8)"
  size="medium"
  color="#fff"
  type="ball-scale-multiple">
</ngx-spinner>
  `,
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Stores';
}
