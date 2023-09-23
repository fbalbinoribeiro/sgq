import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { managerGuard } from './guards/manager.guard';
import { adminGuard } from './guards/admin.guard';

const routes: Routes = [
  {
    path: 'login',
    loadChildren: () =>
      import('./pages/login/login.module').then((m) => m.LoginModule),
  },
  {
    path: 'home',
    loadChildren: () =>
      import('./pages/home/home.module').then((m) => m.HomeModule),
    canLoad: [authGuard],
    canActivate: [authGuard],
  },
  {
    path: 'checklists',
    loadChildren: () =>
      import('./pages/checklists/checklists.module').then(
        (m) => m.ChecklistsModule
      ),
    canLoad: [authGuard, managerGuard],
    canActivate: [authGuard, managerGuard],
  },
  {
    path: 'users',
    loadChildren: () =>
      import('./pages/users/users.module').then((m) => m.UsersModule),
    canLoad: [authGuard, adminGuard],
    canActivate: [authGuard, adminGuard],
  },
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: '/login',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
