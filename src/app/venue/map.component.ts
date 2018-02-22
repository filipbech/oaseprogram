import { Component } from '@angular/core';

@Component({
  selector: 'app-map',
  template: `
    Here is a map...<br/><br/>
    <ul>
      <li><a routerLink="/venue/1">Store telt</a></li>
      <li><a routerLink="/venue/2">Venue 2</a></li>
      <li><a routerLink="/venue/3">Venue 3</a></li>
    </ul>


    <button (click)="showMe()">where am i?</button>
    <br/>
    {{ position | json }}
  `
})
export class MapComponent {
  position;
  showMe() {
    navigator.geolocation.getCurrentPosition(({timestamp, coords: { accuracy, latitude, longitude}}) => {
      this.position = {timestamp, accuracy, latitude, longitude};
    });
  }
}
