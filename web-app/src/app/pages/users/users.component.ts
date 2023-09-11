import { Component } from '@angular/core';
import { User, UserRole } from 'src/app/models/user';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
})
export class UsersComponent {
  users: User[] = [
    new User(1, 'John', 'john@123.com', UserRole.ADMIN),
    new User(2, 'Jane', 'jane@123.com', UserRole.MANAGER),
    new User(3, 'Joe', 'joe@123.com', UserRole.GENERAL),
  ];
}
