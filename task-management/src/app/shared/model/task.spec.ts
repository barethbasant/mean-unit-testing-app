import { Task } from './task';

describe('Task Model', () => {
  let taskData: Task[];
  beforeEach(() => {
    taskData = [
      {
        id: 1,
        title: 'Test Task',
        description: 'This is a test task',
        dueDate: new Date('2023-12-31'),
        completed: false,
      },
    ];
  });
  it('should create an instance', () => {
    const { id, title, description, completed, dueDate } = taskData[0];
    const task = new Task(id, title, description, dueDate, completed);

    expect(task).toBeDefined();
    expect(task.id).toBe(id);
    expect(task.title).toBe(title);
    expect(task.description).toBe(description);
    expect(task.dueDate).toEqual(dueDate);
    expect(task.completed).toBe(completed);
    expect(task).toBeTruthy();
  });

  it('should have a default value for completed as false', () => {
    const { id, title, description, dueDate } = taskData[0];
    const task = new Task(id, title, description, dueDate);
    expect(task.completed).toBe(false);
  });

  it('should create an instance with default values', () => {
    const task = new Task(2, 'Default Task', null, new Date(), true);

    expect(task).toBeDefined();
    expect(task.id).toBe(2);
    expect(task.title).toBe('Default Task');
    expect(task.description).toBe(null);
    expect(task.dueDate instanceof Date).toBe(true);
    expect(task.completed).toBe(true);
  });

  it(`should set description to empty if not provided`, () => {
    const task = new Task(
      3,
      'Task Without Description',
      null,
      new Date('2023-12-31'),
      true
    );
    expect(task.description).toBe(null);
  });
});
