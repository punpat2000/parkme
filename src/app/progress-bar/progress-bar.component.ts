import { Component } from '@angular/core';
import { LoadingEventService } from 'src/app/core/services';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-progress-bar',
  template: `<ion-progress-bar *ngIf="loadStatus$ | async" type="indeterminate" style="position: fixed; z-index: 1;"></ion-progress-bar>`
})
export class ProgressBarComponent {

  public loadStatus$: Observable<boolean>;

  constructor(private lds: LoadingEventService) {
    this.loadStatus$ = this.lds.eventEmitter();
  }

}