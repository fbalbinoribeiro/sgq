import { ChangeDetectorRef, Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { BehaviorSubject, Observable, map, switchMap } from 'rxjs';
import { MaterialModule } from 'src/app/components/material.module';
import { User, UserRole } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';

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

  event$: BehaviorSubject<void> = new BehaviorSubject<void>(undefined);
  users$: Observable<User[]> = this.event$.pipe(
    switchMap(() => this.userService.getAll()),
    map((users) => users.slice())
  );

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

  constructor(
    private readonly dialog: MatDialog,
    private readonly userService: UserService,
    private readonly changeDetectorRef: ChangeDetectorRef
  ) {}

  openDeleteDialog(user: User): void {
    const dialogRef = this.dialog.open(DialogDeleteDialog, {
      data: { user },
    });

    dialogRef.afterClosed().subscribe((user) => {
      if (user) {
        this.userService.delete(user.id).subscribe((deleted) => {
          if (deleted) {
            this.event$.next();
            this.userForm.reset();
          }
        });
      }
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
        this.selectedUser?.id,
        this.userForm.value.name,
        this.userForm.value.email,
        this.userForm.value.role
      );

      if (user.id) {
        this.userService.update(user.id, user).subscribe((updated) => {
          if (updated) {
            this.event$.next();
            this.userForm.reset();
          }
        });
        return;
      }

      this.userService.create(user).subscribe((created) => {
        if (created) {
          this.event$.next();
          this.userForm.reset();
        }
      });
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
