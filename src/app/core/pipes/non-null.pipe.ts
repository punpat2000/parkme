import { Pipe, PipeTransform, Type } from '@angular/core';
import { invalidOtherwiseValues } from './invalid-pipe-argument-error';
import { isString, last } from 'lodash';

@Pipe({
	name: 'nonNull',
	pure: true,
})
export class NonNullPipe implements PipeTransform {
	transform(
		value: unknown | string | null | undefined,
		...args: Array<unknown | string | null | undefined>
	): string {
		if (isString(value)) return value! as string;
		for (let i = 0; i < args.length; i++)
			if (isString(args[i])) return args[i]! as string;
		console.log(last(args));
		throw invalidOtherwiseValues(NonNullPipe);
	}
}
