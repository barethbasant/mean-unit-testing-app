import { TaskStatusPipe } from './task-status.pipe';
let pipe: TaskStatusPipe;
describe('TaskStatusPipe', () => {
  beforeEach(() => {
    pipe = new TaskStatusPipe();
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it(`should display Completed if true value passed`, () => {
    const taskStatus = pipe.transform(true);
    expect(taskStatus).toBe('Completed');
  });

  it(`should display Pending if false value is passed`, () => {
    const taskStatus = pipe.transform(false);
    expect(taskStatus).toBe('Pending');
  });
});
