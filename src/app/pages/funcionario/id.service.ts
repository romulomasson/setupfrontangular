import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class IdService {
  private id: any;

  setId(id: any): void {
    this.id = id;
  }

  getId(): any {
    return this.id;
  }
}