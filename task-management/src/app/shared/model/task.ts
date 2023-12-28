export class Task {
  constructor(
    public id: number | null,
    public title: string,
    public description: string | null = '',
    public dueDate: Date,
    public completed: boolean = false
  ) {}
}
