import { Pipe, PipeTransform } from '@angular/core';
import { UserRole } from '../models/user';

@Pipe({
  name: 'userRole',
})
export class UserRolePipe implements PipeTransform {
  transform(value: number, ...args: unknown[]): string {
    switch (value) {
      case UserRole.ADMIN:
        return 'Administrador';
      case UserRole.MANAGER:
        return 'Gestor';
      case UserRole.GENERAL:
      default:
        return 'Colaborador';
    }
  }
}
