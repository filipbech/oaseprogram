import { Component } from '@angular/core';

@Component({
  selector: 'home',
  template: `
    <h1>Hjem</h1>
    <a routerLink="/program/2017-07-17">Mandag</a>
    <a routerLink="/program/2017-07-18">Tirsdag</a>

    <a routerLink="/speaker/1">Kim Thinggaard</a>
  `
})
export class HomeComponent {}
