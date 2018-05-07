import { Component } from '@angular/core';
import { conf } from './configuration';

import { info } from './icons/info';
import { livestream } from './icons/livestream';
import { program } from './icons/program';
import { map } from './icons/map';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { TrackingService } from './tracking.service';

@Component({
  selector: 'app-root',
  template: `
    <header><a routerLink="/">${conf.title}</a></header>
    <div class="content">
      <router-outlet></router-outlet>
    </div>
    <footer>
      <nav class="center">
        <a routerLinkActive="active" [routerLink]="['program']">${program} <span>Program</span></a>
        <a routerLinkActive="active" [routerLink]="['map']">${map} <span>Kort</span></a>
        <a routerLinkActive="active" [routerLink]="['livestream']">${livestream} <span>Livestream</span></a>
        <a routerLinkActive="active" [routerLink]="['info']">${info} <span>Hvad er?</span></a>
      </nav>
    </footer>
  `
})
export class AppComponent {

  constructor(
    private router: Router,
    private trackingService: TrackingService
  ) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
    )
    .subscribe((event: NavigationEnd) => {
      this.trackingService.trackPageView(event.url);
    });
  }
}
