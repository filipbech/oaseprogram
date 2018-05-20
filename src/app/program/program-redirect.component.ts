import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DataService } from '../data.service';
import { takeUntil, combineLatest } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-program-redirect',
  template: ''
})
export class ProgramRedirectComponent implements OnInit, OnDestroy {
  destroy = new Subject();

  ngOnInit() {
    const today = new Date();
    const todayTime = today.getTime();


    this.dataService.getFirstLastEventStart()
      .pipe(
        combineLatest(this.activatedRoute.queryParams),
        takeUntil(this.destroy),
      )
      .subscribe(([firstLast, queryParams]) => {
        if (!firstLast.first) {
          return;
        }
        if (todayTime > firstLast.first) {
          if (todayTime < firstLast.last) {
            this.router.navigate(['program', this.dataService.toDateString(today)], { queryParams, skipLocationChange: true });
            return;
          }
          this.router.navigate(['program', this.dataService.toDateString(new Date(firstLast.last))],
            { queryParams, skipLocationChange: true });
        } else {
          this.router.navigate(['program', this.dataService.toDateString(new Date(firstLast.first))],
            { queryParams, skipLocationChange: true  });
        }
      });
  }

  ngOnDestroy() {
    this.destroy.next();
    this.destroy.complete();
  }

  constructor(
    private router: Router,
    private dataService: DataService,
    private activatedRoute: ActivatedRoute
  ) {}
}
