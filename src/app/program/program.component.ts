import { Component } from '@angular/core';
import { ProgramService } from './program.service';

@Component({
  selector: 'app-program',
  template: `
    <h1>Program</h1>
    <ul>
      <li *ngFor="let item of program | async">{{ item.title }}</li>
    </ul>
  `
})
export class ProgramComponent {
  program = this.programService.programItems$;

  constructor(private programService: ProgramService) {}
}
