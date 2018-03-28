import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../data.service';
import { takeUntil } from 'rxjs/operators/takeUntil';
import { Subject } from 'rxjs/Subject';

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
      .pipe(takeUntil(this.destroy))
      .subscribe(firstLast => {
        if (!firstLast.first) {
          return;
        }
        if (todayTime > firstLast.first) {
          if (todayTime < firstLast.last) {
            this.router.navigate(['program', this.dataService.toDateString(today)]);
            return;
          }
          this.router.navigate(['program', this.dataService.toDateString(new Date(firstLast.last))]);
        } else {
          this.router.navigate(['program', this.dataService.toDateString(new Date(firstLast.first))]);
        }
      });
  }

  ngOnDestroy() {
    this.destroy.next();
    this.destroy.complete();
  }

  constructor(
    private router: Router,
    private dataService: DataService
  ) {}
}
