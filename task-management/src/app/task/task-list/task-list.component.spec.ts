import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavigationExtras, UrlTree } from '@angular/router';

import { TaskListComponent } from './task-list.component';
import { TaskService } from 'src/app/task.service';
import { Task } from 'src/app/shared/model/task';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { RouterTestingModule } from '@angular/router/testing';
import { TaskStatusPipe } from '../task-status.pipe';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { By } from '@angular/platform-browser';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HighlightDirective } from 'src/app/shared/highlight.directive';

describe('TaskListComponent', () => {
  let component: TaskListComponent;
  let fixture: ComponentFixture<TaskListComponent>;
  let taskService: jasmine.SpyObj<TaskService>;
  let toastrService: jasmine.SpyObj<ToastrService>;

  beforeEach(() => {
    const taskServiceSpy = jasmine.createSpyObj('TaskService', [
      'getTasks',
      'deleteTask',
    ]);

    const toastrServiceSpy = jasmine.createSpyObj('ToastrService', [
      'success',
      'error',
    ]);

    TestBed.configureTestingModule({
      declarations: [TaskListComponent],
      providers: [
        { provide: TaskService, useValue: taskServiceSpy },
        { provide: ToastrService, useValue: toastrServiceSpy },
      ],
      imports: [RouterTestingModule],
    });

    // TestBed.overrideComponent(TaskListComponent, {
    //   set: {
    //     providers: [
    //       { provide: TaskService, useValue: taskServiceSpy },
    //       { provide: ToastrService, useValue: toastrServiceSpy },
    //     ],
    //   },
    // });

    fixture = TestBed.createComponent(TaskListComponent);
    component = fixture.componentInstance;
    taskService = TestBed.inject(TaskService) as jasmine.SpyObj<TaskService>;
    toastrService = TestBed.inject(
      ToastrService
    ) as jasmine.SpyObj<ToastrService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it(`should call getTasks on ngOnInit`, () => {
    const mockTasks: Task[] = [
      {
        id: 1,
        title: 'Task 1',
        description: 'Description 1',
        dueDate: new Date(),
        completed: false,
      },
    ];

    taskService.getTasks.and.returnValue(of({ data: mockTasks }));
    component.ngOnInit();
    expect(taskService.getTasks).toHaveBeenCalled();
    expect(component.tasks).toEqual(mockTasks);
  });

  it(`should navigate to tasks/add on addTask`, () => {
    const routerSpy = spyOn(TestBed.inject(Router), 'navigateByUrl');

    component.addTask();

    const navigationExtras: NavigationExtras = {
      skipLocationChange: false,
    };

    const expectedUrl: string | UrlTree = TestBed.inject(Router).createUrlTree(
      ['tasks/add'],
      navigationExtras
    );
    expect(routerSpy).toHaveBeenCalled();
  });

  it('should navigate to "tasks/{taskId}/edit" on editTask', () => {
    const routerSpy = spyOn(TestBed.inject(Router), 'navigateByUrl');
    const mockTask: Task = {
      id: 1,
      title: 'Task 1',
      description: 'Description 1',
      dueDate: new Date(),
      completed: false,
    };
    component.editTask(mockTask);
    expect(routerSpy).toHaveBeenCalled();
  });

  it(`should call deleteTask`, () => {
    const mockTask: Task = {
      id: 1,
      title: 'Task 1',
      description: 'Description 1',
      dueDate: new Date(),
      completed: false,
    };

    taskService.deleteTask.and.returnValue(
      of({ message: 'Task deleted successfully' })
    );
    const getTasksSpy = spyOn(component, 'getTasks').and.callThrough();

    component.deleteTask(mockTask);

    expect(taskService.deleteTask).toHaveBeenCalled();
    expect(getTasksSpy).toHaveBeenCalled();
  });

  it('should show error toastr on deleteTask if there is an error', () => {
    const mockTask: Task = {
      id: 1,
      title: 'Task 1',
      description: 'Description 1',
      dueDate: new Date(),
      completed: false,
    };
    const errorMessage = 'Error deleting task';
    taskService.deleteTask.and.returnValue(
      throwError({ error: { message: errorMessage } })
    );
    component.deleteTask(mockTask);
    expect(toastrService.error).toHaveBeenCalledWith(errorMessage, 'Error');
  });
});

describe(`TaskListComponent UI`, () => {
  let component: TaskListComponent;
  let fixture: ComponentFixture<TaskListComponent>;
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TaskListComponent, TaskStatusPipe, HighlightDirective],
      imports: [RouterTestingModule, HttpClientTestingModule, ToastrModule.forRoot()],
    });
    fixture = TestBed.createComponent(TaskListComponent);
    component = fixture.componentInstance;
    component.tasks = [
      {
        id: 1,
        title: 'Task 1',
        description: 'Description 1',
        dueDate: new Date(),
        completed: false,
      },
    ];

    fixture.detectChanges();
  });

  it('should display task information in the template', () => {
    const taskElement = fixture.debugElement.query(By.css('.list-group-item'));

    expect(taskElement.nativeElement.textContent).toContain('Task 1');
    expect(taskElement.nativeElement.textContent).toContain('Description 1');
  });

  it('should call editTask method when the "Edit" button is clicked', () => {
    const editButton = fixture.debugElement.query(By.css('.btn-warning'));
    spyOn(component, 'editTask');
    editButton.nativeElement.click();
    expect(component.editTask).toHaveBeenCalled();
  });

  it('should call deleteTask method when the "Delete" button is clicked', () => {
    const deleteButton = fixture.debugElement.query(By.css('.btn-danger'));
    spyOn(component, 'deleteTask');
    deleteButton.nativeElement.click();
    expect(component.deleteTask).toHaveBeenCalled();
  });
});
