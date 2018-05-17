import { Component } from '@angular/core';
import { conf } from './configuration';

import { info } from './icons/info';
import { livestream } from './icons/livestream';
import { program } from './icons/program';
import { arrow } from './icons/arrow';
import { map } from './icons/map';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { TrackingService } from './tracking.service';
import { OfflineService } from './offline.service';
import { DataService } from './data.service';

@Component({
  selector: 'app-root',
  template: `
    <header>
      <div class="center">
        <button (click)="goBack()" class="backBtn">${arrow}</button>
        <a routerLink="/">${conf.title}</a>
      </div>
    </header>
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

  goBack() {
    history.back();
  }

  constructor(
    private router: Router,
    private trackingService: TrackingService,
    private dataService: DataService,
    private offlineService: OfflineService
  ) {

    // check to see if launched from homescreen!
    if (!this.offlineService.stored && (location.search === '?homescreen' || window.matchMedia('(min-width:800px)').matches)) {
      this.offlineService.startDownload(Array.from(this.dataService.allImages));
    }

    // if (location.search === '?homescreen') {
    //   // restore last current url from state on iOS (if not too old)
    // }

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
    )
    .subscribe((event: NavigationEnd) => {
      this.trackingService.trackPageView(event.url);
      // later: keep state of current url
    });
  }
}
