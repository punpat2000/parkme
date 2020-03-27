import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { untilDestroyed } from 'ngx-take-until-destroy';
import {
  Router,
  ChildActivationStart,
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LoadingEventService implements OnDestroy {

  private _loadingEvent: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  constructor(
    private router: Router
  ) {
    this.routerEventListener();
  }

  private routerEventListener(): void {
    this.router.events
      .pipe(untilDestroyed(this))
      .subscribe(event => {
        if (
          event instanceof NavigationStart ||
          event instanceof ChildActivationStart
        ) {
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
