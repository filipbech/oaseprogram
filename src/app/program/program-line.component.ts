import { Component, Input, OnChanges } from '@angular/core';
import { clock } from '../icons/clock';
import { IEvent } from '../data.model';
import { dayNames } from '../data.service';

@Component({
  selector: 'app-program-line',
  template: `
    <a [routerLink]="['/program/event', event.id]" [style.color]="event.trackColor">
      <div class="time">
        ${clock}
        {{ event.date.start | date: 'HH:mm' }} - {{ event.date.end | date: 'HH:mm' }}
        <ng-container *ngIf="displayDay">
          ({{event.day}})
        </ng-container>
      </div>
      <div class="title">{{ event.name }}</div>
      <div class="category">{{ event.speakerName }}</div>
      <div class="category">{{ event.trackName }}, {{ event.venueName }}</div>
    </a>
  `
})
export class ProgramLineComponent implements OnChanges {
  @Input() event: IEvent;
  @Input() displayDay: Boolean = false;

  dayNames = dayNames;

  ngOnChanges() {
    if (this.displayDay) {
      this.event['day'] = this.dayNames[new Date(this.event.date.start).getDay()];
    }
  }
}
