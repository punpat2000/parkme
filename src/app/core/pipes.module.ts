import { NgModule } from '@angular/core';
import { AsyncPluckPipe } from './pipes/async-pluck.pipe';
import { NonNullPipe } from './pipes/non-null.pipe';

@NgModule({
    declarations: [NonNullPipe, AsyncPluckPipe],
    exports: [NonNullPipe, AsyncPluckPipe]
})
export class PipesModule {}