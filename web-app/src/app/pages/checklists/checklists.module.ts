import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { MaterialModule } from 'src/app/components/material.module';
import { SharedComponentsModule } from 'src/app/components/shared-components.module';
import { ChecklistsRoutingModule } from './checklists-routing.module';
import { ChecklistsComponent } from './checklists.component';

@NgModule({
  declarations: [ChecklistsComponent],
  imports: [
    CommonModule,
    ChecklistsRoutingModule,
    SharedComponentsModule,
    MaterialModule,
  ],
})
export class ChecklistsModule {}
