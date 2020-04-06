import { Pipe, PipeTransform } from '@angular/core';
import { isString } from 'util';

@Pipe({
  name: 'nonNull',
  pure: true,
})
export class NullCoalescePipe implements PipeTransform {

  transform(
    value: unknown | string | null | undefined,
    ...args: Array<unknown | string | null | undefined>
  ): string {
    if (isString(value))
      return value as string;
    for (let i = 0; i < args.length; i++) {
      if (isString(args[i]))
        return args[i] as string;
    }
    return '';
  }
}