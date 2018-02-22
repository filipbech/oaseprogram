import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'app-venue',
  template: `
    Vis navn, info og program for Venue {{ id }}
  `
})
export class VenueComponent implements OnInit {
  id = 0;
  destroy = new Subject();

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.id = params['venueId'];
    });
  }

  ngOnDestroy() {
    this.destroy.next();
    this.destroy.complete();
  }

  constructor(private activatedRoute: ActivatedRoute) {}
}
