import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';

const components = [MatToolbarModule];

@NgModule({
  imports: [CommonModule, ...components],
  exports: [...components],
})
export class MaterialModule {}
