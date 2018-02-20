import { Component } from '@angular/core';
import { ProgramService } from './program.service';

@Component({
  selector: 'app-program',
  template: `
    <h1>Program</h1>
    <p>filter-options</p>
    <button (click)="updateFilter()">Filter by venue = 1</button>
    <ul>
      <li *ngFor="let item of program | async">{{ item.title }} ❤️</li>
    </ul>
  `
})
export class ProgramComponent {
  program = this.programService.filteredProgramItems$;

  updateFilter() {
    this.programService.setFilter({ venueIds: 1 });
  }

  constructor(private programService: ProgramService) {}
}
