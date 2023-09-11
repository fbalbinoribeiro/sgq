import { User } from './user';

export enum ChecklistAllowedTypes {
  CHECKBOX,
  YES_NO,
  TEXT,
  NUMBER,
  DATE,
}

export class ChecklistCustomField {
  constructor(
    public id: number,
    public user: User,
    public checklistField: ChecklistAllowedTypes,
    public description: string
  ) {}
}

export class Checklist {
  constructor(
    public id: number,
    public name: string,
    public description: string,
    public customFields: ChecklistCustomField[]
  ) {}
}
