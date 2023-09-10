import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MaterialModule } from './material.module';
import { ToolbarComponent } from './toolbar/toolbar.component';

const components = [ToolbarComponent];

@NgModule({
  declarations: [...components],
  imports: [CommonModule, MaterialModule],
  exports: [...components],
})
export class SharedComponentsModule {}
