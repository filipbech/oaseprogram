import { Component } from '@angular/core';

@Component({
  selector: 'map',
  template: `
    Here is a map...
    <button (click)="showMe()">where am i?</button>

  `
})
export class MapComponent {

  showMe() {
    navigator.geolocation.getCurrentPosition(pos => {
      console.log(pos);
    });
  }
}
