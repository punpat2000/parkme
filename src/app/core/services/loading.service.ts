import { Injectable, OnDestroy } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import {
  Router,
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
} from '@angular/router';
import { UntilDestroy } from '@ngneat/until-destroy';

@UntilDestroy()
@Injectable({
  providedIn: 'root'
})
export class LoadingEventService implements OnDestroy {

  private _loadingEvent: Subject<boolean> = new Subject<boolean>();

  constructor(
    private router: Router
  ) {
    this.routerEventListener();
  }

  private routerEventListener(): void {
    this.router.events
      .subscribe(event => {
        if (event instanceof NavigationStart) {
          this.show();
        } else if (
          event instanceof NavigationEnd ||
          event instanceof NavigationError ||
          event instanceof NavigationCancel
        ) {
          this.hide();
        }
      });
  }

  ngOnDestroy() { }

  eventEmitter(): Observable<boolean> {
    return this._loadingEvent.asObservable();
  }
  show(): void {
    this._loadingEvent.next(true);
  }
  hide(): void {
    this._loadingEvent.next(false);
  }

  
}
