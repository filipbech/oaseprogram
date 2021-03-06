import { Component } from '@angular/core';
import { DataService } from '../data.service';
import { ITrackCategory } from '../data.model';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-track-list',
  template: `
  <h1>Spor-beskrivelser</h1>
    <div *ngFor="let category of tracks | async">
      <h3>{{category.type}}</h3>
      <div class="links">
        <a
          *ngFor="let track of category.tracks"
          [routerLink]="['/spor', track.id]"
        >
          <div class="wrap">
            <img [src]="track.imgUrl" alt="" loading="lazy" />
            {{track.name}}
          </div>
        </a>
      </div>
    </div>
  `
})
export class TrackListComponent {
  tracks: Observable<ITrackCategory[]> = this.dataService.tracks$;

  constructor(private dataService: DataService) {}
}
