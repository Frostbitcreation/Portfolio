import { Component } from '@angular/core';

@Component({
  selector: 'ab-test-app',
  template: `
  <router-outlet></router-outlet>
  `
})
export class ABTestManagerAppComponent {
  title = "test";
}
