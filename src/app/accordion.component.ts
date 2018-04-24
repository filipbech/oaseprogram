import { Component, HostBinding } from '@angular/core';
import { arrow } from './icons/arrow';

@Component({
  selector: 'app-accordion',
  template: `
	<button class="accordion__title" (click)="toggle()">
    <ng-content select="[accordion-title]"></ng-content>
    ${arrow}
	</button>
	<div class="accordion__content" [hidden]="!visible">
		<ng-content select="[accordion-content]"></ng-content>
	</div>`
})
export class AccordionComponent {
  @HostBinding('class.open')
  public visible = false;

  toggle() {
    this.visible = !this.visible;
  }
}
