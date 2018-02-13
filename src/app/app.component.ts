import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <h1>OasePrgram</h1>
    <p>{{ message }}</p>

    <app-program></app-program>
  `
})
export class AppComponent {
  message = 'this works...';
}
