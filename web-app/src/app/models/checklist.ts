export class Checklist {
  constructor(
    public id: string,
    public name: string,
    public description: string,
    public sections: ChecklistSection[]
  ) {}
}

export class ChecklistSection {
  constructor(
    public sectionName: string,
    public requests: ChecklistRequest[]
  ) {}
}

export class ChecklistRequest {
  constructor(public requestDescription: string) {}
}
