import { Component } from '@angular/core';
import { DataService } from '../data.service';

@Component({
  selector: 'app-info',
  template: `
    <h1>SommerOase ABC</h1>
    <div [innerHTML]="info | async"></div>
  `
})
export class InfoPageComponent {

  info = this.dataService.info$;

  constructor(
    private dataService: DataService
  ) { }
}
