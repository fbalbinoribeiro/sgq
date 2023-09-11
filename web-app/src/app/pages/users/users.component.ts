import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { MaterialModule } from 'src/app/components/material.module';
import { User, UserRole } from 'src/app/models/user';

// The Angular default validator has a strange behavior where for example abc@xyz is considered valid.
const EMAIL_REGEX = /^[A-Za-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
})
export class UsersComponent {
  userRoles: number[] = Object.values(UserRole)
    .filter((role) => typeof role === 'number')
    .map((role) => role as number);

  selectedUser: User | undefined;

  users: User[] = [
    new User(1, 'John', 'john@123.com', UserRole.ADMIN),
    new User(2, 'Jane', 'jane@123.com', UserRole.MANAGER),
    new User(3, 'Joe', 'joe@123.com', UserRole.GENERAL),
  ];

  userForm: FormGroup = new FormGroup({
    name: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(50),
    ]),
    email: new FormControl('', [
      Validators.required,
      Validators.pattern(EMAIL_REGEX),
    ]),
    role: new FormControl('', [Validators.required]),
  });

  constructor(private readonly dialog: MatDialog) {}

  openDeleteDialog(user: User): void {
    const dialogRef = this.dialog.open(DialogDeleteDialog, {
      data: { user },
    });

    dialogRef.afterClosed().subscribe((user) => {
      this.users = this.users.filter((u) => u.id !== user?.id);
    });
  }

  edit(user: User) {
    this.selectedUser = user;
    this.userForm.setValue({
      name: user.name,
      email: user.email,
      role: user.role,
    });
  }

  reset() {
    this.userForm.reset();
    this.selectedUser = undefined;
  }

  onSubmit() {
    if (this.userForm.valid) {
      const user = new User(
        this.selectedUser?.id ?? this.users.length + 1,
        this.userForm.value.name,
        this.userForm.value.email,
        this.userForm.value.role
      );

      this.users = this.users
        .filter((x) => x.id !== user.id)
        .concat(user)
        .sort((a, b) => a.id - b.id);
      this.userForm.reset();
    }
  }
}

@Component({
  selector: 'dialog-delete-dialog',
  template: `
    <h1 mat-dialog-title>Deletar {{ data.user.name }}</h1>
    <div mat-dialog-content>
      <p>Deseja prosseguir?</p>
    </div>
    <div mat-dialog-actions>
      <button mat-button [mat-dialog-close]="">Não</button>
      <button mat-button [mat-dialog-close]="data.user" cdkFocusInitial>
        Sim
      </button>
    </div>
  `,
  standalone: true,
  imports: [MaterialModule],
})
export class DialogDeleteDialog {
  constructor(
    public dialogRef: MatDialogRef<DialogDeleteDialog>,
    @Inject(MAT_DIALOG_DATA) public data: { user: User }
  ) {}
}
