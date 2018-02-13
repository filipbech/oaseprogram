import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/observable';
import { IProgramItem } from './program.model';
import { API_PREFIX } from '../core.module';

@Injectable()
export class ProgramService {

  getProgram(): Observable<IProgramItem> {
    return this.http.get<IProgramItem>(API_PREFIX + '/api/program.json');
  }

  constructor(private http: HttpClient) {}

}

