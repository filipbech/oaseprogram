import { Component, OnInit, OnDestroy } from '@angular/core';
import { IProgramItem } from './program.model';
import { ActivatedRoute } from '@angular/router';
import { ProgramService } from './program.service';
import { switchMap } from 'rxjs/operators/switchMap';
import { takeUntil } from 'rxjs/operators/takeUntil';
import { Subject } from 'rxjs/Subject';


@Component({
  selector: 'app-program-detail',
  template: `
    Details for {{event.title}}
  `
})
export class ProgramDetailComponent implements OnInit, OnDestroy{
  event: IProgramItem;

  destroy = new Subject();

  ngOnInit() {
    this.activatedRoute.params.pipe(
      takeUntil(this.destroy),
      switchMap(params => this.programService.getProgramItem(parseFloat(params['eventId'])))
    ).subscribe(event => this.event = event);
  }

  ngOnDestroy() {
    this.destroy.next();
    this.destroy.complete();
  }

  constructor(
    private activatedRoute: ActivatedRoute,
    private programService: ProgramService
  ) { }
}
