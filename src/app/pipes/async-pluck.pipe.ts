import {
  ChangeDetectorRef,
  EventEmitter,
  OnDestroy,
  Pipe,
  PipeTransform,
  WrappedValue,
  ɵstringify as stringify,
  ɵisObservable as isObservable,
  ɵlooseIdentical as looseIdentical,
  Type
} from '@angular/core';
import { Observable, SubscriptionLike } from 'rxjs';
import { pluck } from 'rxjs/operators';
import { invalidPipeArgumentError, invalidObservablePropertyError } from './invalid-pipe-argument-error';
import { isString } from 'lodash';

class ObservableStrategy {
  constructor() { }
  createSubscription(
    properties: Array<string>,
    async: Observable<any>,
    updateLatestValue: (value: Object) => void,
  ): SubscriptionLike {
    return async.pipe(pluck(...properties))
      .subscribe({
        next: updateLatestValue,
        error: console.log
      });
  }
  dispose(subscription: SubscriptionLike): void {
    subscription.unsubscribe();
  }
  onDestroy(subscription: SubscriptionLike): void {
    subscription.unsubscribe();
  }
}

@Pipe({
  name: 'asyncPluck',
  pure: false
})
export class AsyncPluckPipe implements OnDestroy, PipeTransform {

  private _latestValue: any = null;
  private _latestReturnedValue: any = null;
  private _subscription: SubscriptionLike | null = null;
  private _obj: Observable<any> | EventEmitter<any> | null = null;
  private _strategy: ObservableStrategy = null!!;
  // private _property: any; for future feature: async properties

  constructor(
    private _ref: ChangeDetectorRef
  ) { console.log(!!this._strategy);}

  ngOnDestroy(): void {
    if (this._subscription)
      this._dispose();
  }

  transform<T>(obj: null, ...properties: Array<string | unknown>): null;
  transform<T>(obj: undefined, ...properties: Array<string | unknown>): undefined;
  transform<T>(obj: Observable<T> | null | undefined, ...properties: Array<string | unknown>): T | null;
  transform(obj: Observable<any> | null | undefined, ...properties: Array<string | unknown>): any {
    // invalid property caught
    if (!Array.isArray(properties))
      throw invalidObservablePropertyError(AsyncPluckPipe, properties);
    for (let i = 0; i < properties.length; i++)
      if (!isString(properties[i]))
        throw invalidObservablePropertyError(AsyncPluckPipe, properties[i]);

    // ดfirst case, fresh observable
    if (!this._obj) {
      if (obj)
        this._subscribe(obj, properties as Array<string>);
      this._latestReturnedValue = this._latestValue;
      return this._latestValue;
    }
    // second case, observable changes
    if (obj !== this._obj) {
      // dispose the old one first
      this._dispose();
      // recursively called itself to go back to the first state
      return this.transform(obj as any, properties as Array<string>);
    }

    // check if the latest value and the latest return value are identical. if so then ok
    if (looseIdentical(this._latestValue, this._latestReturnedValue))
      return this._latestReturnedValue;

    // in case the result has changed even tho the reference hasn't
    this._latestReturnedValue = this._latestValue;
    return WrappedValue.wrap(this._latestValue);
  }

  private _subscribe(obj: Observable<any> | EventEmitter<any>, properties: Array<string>): void {
    this._obj = obj;
    this._strategy = this._selectStrategy(obj);
    this._subscription = this._strategy.createSubscription(
      properties,
      obj,
      (value: Object) => this._updateLatestValue(obj, value)
    );
    /* console.log([
      this._subscription instanceof Observable,
      this._subscription instanceof BehaviorSubject,
    ]) */
  }

  private _selectStrategy(obj: Observable<any>): ObservableStrategy {
    if (isObservable(obj))
      return new ObservableStrategy();

    throw invalidPipeArgumentError(AsyncPluckPipe, obj);
  }

  private _dispose(): void {
    this._strategy.dispose(this._subscription!);
    this._latestValue = null;
    this._latestReturnedValue = null;
    this._subscription = null;
    this._obj = null;
  }

  private _updateLatestValue(async: Observable<any> | EventEmitter<any>, value: Object): void {
    if (async === this._obj) {
      this._latestValue = value;
      this._ref.markForCheck();
    }
  }
}