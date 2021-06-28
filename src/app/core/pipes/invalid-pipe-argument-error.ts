import { Type } from '@angular/core';
import { NonNullPipe } from './non-null.pipe';

export function invalidPipeArgumentError(
  type: Type<any>,
  value: Object
): Error {
  return Error(`InvalidPipeArgument: '${value}' for pipe '${type}'`);
}

export function invalidObservablePropertyError(
  type: Type<any>,
  property: any
): Error {
  return Error(
    `InvalidObservableProperty: '${property}' which is of type: '${typeof property}' for pipe '${type}'`
  );
}

export function invalidOtherwiseValues(type: Type<NonNullPipe>): Error {
  return Error(
    `InvalidOtherwiseValues: non-null otherwise values found for pipe '${type}'`
  );
}
