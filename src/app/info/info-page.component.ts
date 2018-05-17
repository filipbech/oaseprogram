import { Component } from '@angular/core';
import { DataService, IInfoCategory } from '../data.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-info',
  template: `
    <h1>SommerOase ABC</h1>

    <app-accordion *ngFor="let category of info | async">
      <div accordion-title>{{category.name}}</div>
      <div accordion-content>
        <div [innerHTML]="category.desc | safe"></div>
        <app-accordion *ngFor="let content of category.content">
          <div accordion-title>{{content.header}}</div>
          <div accordion-content>
            <div [innerHTML]="content.content | safe"></div>
          </div>
        </app-accordion>
      </div>
    </app-accordion>
  `
})
export class InfoPageComponent {

  info: Observable<IInfoCategory[]> = this.dataService.infoCategory$;

  constructor(
    private dataService: DataService
  ) { }
}
