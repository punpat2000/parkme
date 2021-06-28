import { Component } from '@angular/core';
import { LoadingEventService } from 'src/app/core/services';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-progress-bar',
  templateUrl: './progress-bar.component.html',
})
export class ProgressBarComponent {
  public loadStatus$: Observable<boolean>;

  constructor(private lds: LoadingEventService) {
    this.loadStatus$ = this.lds.eventEmitter();
  }
}
