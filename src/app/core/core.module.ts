import { NgModule } from '@angular/core';
import { AsyncPluckPipe } from './pipes/async-pluck.pipe';
import { NonNullPipe } from './pipes/non-null.pipe';
import { UploadButtonDirective } from './directives/download.directive';

const core = [NonNullPipe, AsyncPluckPipe, UploadButtonDirective];
@NgModule({
  declarations: core,
  exports: core,
})
export class CoreModule {}
