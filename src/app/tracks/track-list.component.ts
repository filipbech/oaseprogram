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
          <img [src]="track.imgUrl" alt="" loading="lazy" />
          {{track.name}}
        </a>
      </div>
    </div>
  `
})
export class TrackListComponent {
  tracks: Observable<ITrackCategory[]> = this.dataService.tracks$.pipe(
    map(trackCategories => trackCategories
      .filter(cat => {
        return (
          cat.type === 'Alders- og interessespor' ||
          cat.type === 'Seminarspor'
        );
      })
    ));

  constructor(private dataService: DataService) {}
}
