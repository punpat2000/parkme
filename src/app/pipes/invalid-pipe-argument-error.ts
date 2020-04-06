import {Type, ɵstringify as stringify} from '@angular/core';

export function invalidPipeArgumentError(type: Type<any>, value: Object) {
  return Error(`InvalidPipeArgument: '${value}' for pipe '${stringify(type)}'`);
}

export function invalidObservablePropertyError(type: Type<any>, property: any) {
  return Error(`InvalidObservableProperty: '${property}' which is of type: '${typeof property}' for pipe '${stringify(type)}'`);
} 