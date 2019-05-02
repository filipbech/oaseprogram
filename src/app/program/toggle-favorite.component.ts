import { Component, Input, Output, EventEmitter } from '@angular/core';
import { IEvent } from '../data.model';
import { favorite } from '../icons/favorite';

@Component({
  selector: 'app-toggle-favorite',
  template: `
    <button [ngClass]="{active: event.isFavorite}" (click)="onClick($event)">${favorite}</button>
  `
})
export class ToggleFavoriteComponent {

  @Output() toggleFav = new EventEmitter();
  @Input() event: IEvent;

  onClick(e) {
    e.preventDefault();
    e.stopPropagation();
    this.toggleFav.emit(this.event);
    return false;
  }
}
