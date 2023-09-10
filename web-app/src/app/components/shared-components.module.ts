import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MaterialModule } from './material.module';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { RouterModule } from '@angular/router';

const components = [ToolbarComponent];

@NgModule({
  declarations: [...components],
  imports: [CommonModule, MaterialModule, RouterModule],
  exports: [...components],
})
export class SharedComponentsModule {}
