import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { MaterialModule } from 'src/app/components/material.module';
import { SharedComponentsModule } from 'src/app/components/shared-components.module';
import { UsersRoutingModule } from './users-routing.module';
import { UsersComponent } from './users.component';

@NgModule({
  declarations: [UsersComponent],
  imports: [
    CommonModule,
    UsersRoutingModule,
    SharedComponentsModule,
    MaterialModule,
  ],
})
export class UsersModule {}
