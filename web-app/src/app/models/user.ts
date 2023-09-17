export enum UserRole {
  GENERAL,
  MANAGER,
  ADMIN,
}

export class User {
  constructor(
    public id: string | undefined,
    public name: string,
    public email: string,
    public role: UserRole
  ) {}
}
