import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TaskService } from './task.service';
import { Task } from './shared/model/task';

describe('TaskService', () => {
  let service: TaskService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TaskService],
    });
    service = TestBed.inject(TaskService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get tasks from the API', () => {
    const mockTasks: Task[] = [
      {
        id: 1,
        title: 'Task 1',
        description: 'Description 1',
        dueDate: new Date('2023-01-01'),
        completed: false,
      },
      {
        id: 2,
        title: 'Task 2',
        description: 'Description 2',
        dueDate: new Date('2023-02-01'),
        completed: true,
      },
    ];

    service.getTasks().subscribe((tasks) => {
      expect(tasks).toEqual(mockTasks);
    });

    const req = httpTestingController.expectOne(`${service.url}/task`);
    expect(req.request.method).toBe('GET');
    req.flush(mockTasks);
  });

  it('should get a task by ID from the API', () => {
    const taskId = 1;
    const mockTask: Task = {
      id: taskId,
      title: 'Task 1',
      description: 'Description 1',
      dueDate: new Date('2023-01-01'),
      completed: false,
    };

    service.getTaskById(taskId).subscribe((task) => {
      expect(task).toEqual(mockTask);
    });

    const req = httpTestingController.expectOne(
      `${service.url}/task/${taskId}`
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockTask);
  });

  it('should add a task via the API', () => {
    const newTask: Task = {
      id: null,
      title: 'New Task',
      description: 'New Description',
      dueDate: new Date('2023-03-01'),
      completed: false,
    };
    const mockTask: Task = { ...newTask };
    service.addTask(newTask).subscribe((task) => {
      expect(task).toEqual(mockTask);
    });

    const req = httpTestingController.expectOne(`${service.url}/task`);
    expect(req.request.method).toBe('POST');
    req.flush(mockTask);
  });

  it('should update a task via the API', () => {
    const taskId = 1;
    const updatedTask: Task = {
      id: taskId,
      title: 'Updated Task',
      description: 'Updated Description',
      dueDate: new Date('2023-04-01'),
      completed: true,
    };
    const mockTask: Task = { ...updatedTask };

    service.updateTask(updatedTask, taskId).subscribe((task) => {
      expect(task).toEqual(mockTask);
    });
    const req = httpTestingController.expectOne(
      `${service.url}/task/${updatedTask.id}`
    );
    expect(req.request.method).toBe('PUT');
    req.flush(mockTask);
  });

  it('should delete a task via the API', () => {
    // Arrange
    const taskId = 1;

    // Act
    service.deleteTask(taskId).subscribe();

    // Assert
    const req = httpTestingController.expectOne(
      `${service.url}/task/${taskId}`
    );
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });
});
