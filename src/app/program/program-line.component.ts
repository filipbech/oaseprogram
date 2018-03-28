import { Component, Input, HostBinding, OnChanges } from '@angular/core';
import { clock } from '../icons/clock';
import { IEvent } from '../data.model';

@Component({
  selector: 'app-program-line',
  template: `
    <a [routerLink]="['/program/event', event.id]">
      <div class="time">
        ${clock}
        {{ event.date.start | date:'shortTime' }} - {{ event.date.end | date:'shortTime' }}
      </div>
      <div class="title">{{ event.name }}</div>
      <div class="category">{{ event.track }}</div>
      <div class="venue">{{ event.venue }}</div>
    </a>
  `
})
export class ProgramLineComponent implements OnChanges {
  @Input() event: IEvent;

  @HostBinding('style.color') color;

  ngOnChanges() {
    this.color = this.event.track === 246643922 ? 'blue' : 'green';
  }
}
