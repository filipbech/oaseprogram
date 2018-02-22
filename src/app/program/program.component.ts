import { Component } from '@angular/core';
import { ProgramService } from './program.service';

@Component({
  selector: 'app-program',
  template: `
    <button (click)="updateFilter()">Filter by category = 1</button>

  <div class="app-program-block">
    <app-program-line *ngFor="let item of program | async" [event]="item"></app-program-line>
  </div>
  `
})
export class ProgramComponent {
  program = this.programService.filteredProgramItems$;

  updateFilter() {
    this.programService.setFilter({ categoryIds: 1 });
  }

  constructor(private programService: ProgramService) {}
}
