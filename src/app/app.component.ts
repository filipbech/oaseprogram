import { Component } from '@angular/core';
import { conf } from './configuration';

import { info } from './icons/info';
import { livestream } from './icons/livestream';
import { program } from './icons/program';
import { arrow } from './icons/arrow';
import { track } from './icons/track';
import { map } from './icons/map';
import { Router, NavigationEnd, ActivationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { TrackingService } from './tracking.service';
import { OfflineService } from './offline.service';
import { DataService } from './data.service';
import { Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  template: `
    <header>
      <div class="center">
        <button (click)="goBack()" class="backBtn" aria-label="Tilbage">${arrow}</button>
        <a routerLink="/" aria-label="Forsiden">${conf.title}</a>
      </div>
    </header>
    <div class="content">
      <router-outlet></router-outlet>
    </div>
    <footer>
      <nav class="center">
        <a routerLinkActive="active" [routerLink]="['program']">${program} <span>Program</span></a>
        <a routerLinkActive="active" [routerLink]="['map']">${map} <span>Kort</span></a>
        <a routerLinkActive="active" [routerLink]="['spor']">${track} <span>Spor</span></a>
        <a routerLinkActive="active" [routerLink]="['livestream']">${livestream} <span>Livestream</span></a>
        <a routerLinkActive="active" [routerLink]="['info']">${info} <span>Info</span></a>
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
    private meta: Meta,
    private offlineService: OfflineService
  ) {

    if (!this.offlineService.stored &&
      (location.search === '?homescreen' || window.matchMedia('(min-width:800px)').matches) && Array.from) {
        setTimeout(_ => {
          this.offlineService.startDownload(Array.from(this.dataService.allImages));
        }, 1000);
    }

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
    )
    .subscribe((event: NavigationEnd) => {
      this.trackingService.trackPageView(event.url);

    });

    this.router.events.pipe(
      filter(event => event instanceof ActivationEnd),
    )
    .subscribe((event: ActivationEnd) => {
      if (event.snapshot.data['noIndex']) {
        this.meta.addTag({ name:'robots', content: 'noindex'});
      } else {
        this.meta.removeTag('name="robots"');
      }
    });

  }
}
