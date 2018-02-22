import { Component } from '@angular/core';
import { conf } from './configuration';

import { info } from './icons/info';
import { livestream } from './icons/livestream';
import { program } from './icons/program';
import { map } from './icons/map';

@Component({
  selector: 'app-root',
  template: `
    <header>${conf.title}</header>
    <div class="content">
      <router-outlet></router-outlet>
    </div>
    <nav>
      <a routerLinkActive="active" [routerLink]="['program']">${program} <span>Program</span></a>
      <a routerLinkActive="active" [routerLink]="['venue']">${map} <span>Kort</span></a>
      <a routerLinkActive="active" [routerLink]="['livestream']">${livestream} <span>Livestream</span></a>
      <a routerLinkActive="active" [routerLink]="['info']">${info} <span>Hvad er?</span></a>
    </nav>
  `
})
export class AppComponent {}
