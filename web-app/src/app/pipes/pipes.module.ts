import { NgModule } from '@angular/core';
import { UserRolePipe } from './user-role.pipe';

const pipes = [UserRolePipe];

@NgModule({
  declarations: [...pipes],
  exports: [...pipes],
})
export class PipesModule {}
