import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-program-redirect',
  template: `this will redirect... to:
  `
})
export class ProgramRedirectComponent implements OnInit {

  ngOnInit() {
    //FBB: TODO: Get first upcoming day with program, or last past day with program...
    this.router.navigate(['program', '2017-07-17']);
  }

  constructor(private router: Router) {}
}
