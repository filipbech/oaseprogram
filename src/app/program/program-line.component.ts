import { Component, Input, HostBinding, OnChanges } from '@angular/core';
import { clock } from '../icons/clock';
import { IProgramItem } from './program.model';

@Component({
  selector: 'app-program-line',
  template: `
    <a [routerLink]="['/program/event', event.id]">
      <div class="time">
        ${clock}
        {{ event.date.from | date:'shortTime' }} - {{ event.date.to | date:'shortTime' }}
      </div>
      <div class="title">{{ event.title }}</div>
      <div class="category">{{ event.categoryIds }}</div>
      <div class="venue">{{ event.venueIds }}</div>
    </a>
  `
})
export class ProgramLineComponent implements OnChanges {
  @Input() event: IProgramItem;

  @HostBinding('style.color') color;

  ngOnChanges() {
    this.color = this.event.categoryIds[0] === 1 ? 'blue' : 'green';
  }
}
