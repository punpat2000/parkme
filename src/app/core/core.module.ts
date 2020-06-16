import { NgModule } from '@angular/core';
import { AsyncPluckPipe } from './pipes/async-pluck.pipe';
import { NonNullPipe } from './pipes/non-null.pipe';
import { UploadButtonDirective } from './directives/download.directive';

@NgModule({
    declarations: [NonNullPipe, AsyncPluckPipe, UploadButtonDirective],
    exports: [NonNullPipe, AsyncPluckPipe, UploadButtonDirective]
})
export class CoreModule {}