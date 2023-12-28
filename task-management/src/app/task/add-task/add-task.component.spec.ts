import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';

import { AddTaskComponent } from './add-task.component';
import { of } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';
import { TaskService } from 'src/app/task.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';

describe('AddTaskComponent', () => {
  let component: AddTaskComponent;
  let fixture: ComponentFixture<AddTaskComponent>;
  let mockTaskService: jasmine.SpyObj<TaskService>;
  let mockToastrService: jasmine.SpyObj<ToastrService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockActivatedRoute: any;

  beforeEach(() => {
    mockTaskService = jasmine.createSpyObj('TaskService', [
      'addTask',
      'updateTask',
      'getTaskById',
    ]);
    mockToastrService = jasmine.createSpyObj('ToastrService', [
      'success',
      'error',
    ]);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockActivatedRoute = {
      params: of({ id: 1 }),
    };

    TestBed.configureTestingModule({
      declarations: [AddTaskComponent],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: TaskService, useValue: mockTaskService },
        { provide: ToastrService, useValue: mockToastrService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ],
    });

    fixture = TestBed.createComponent(AddTaskComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it(`should check the title is alphaneumaric`, () => {
    const data = {
      title: 'ThisIsAnAlphanum123',
      description: '',
      dueDate: new Date(),
    };

    const regex = /^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]+$/;
    // const regex = ^(?=.*[a-zA-Z])(?=.*[0-9])
    const checkAlphaneumaric = (str: string) => {
      return regex.test(str);
    };
    expect(checkAlphaneumaric(data.title)).toBe(true);
  });

  it('should initialize taskForm with default values', () => {
    expect(component.taskForm.value).toEqual({
      title: '',
      description: '',
      dueDate: component.formattedDate,
      completed: 'false',
    });
  });

  it('should display the title input field', () => {
    const titleInput = fixture.nativeElement.querySelector(
      'input[formControlName="title"]'
    );
    expect(titleInput).toBeTruthy();
  });

  it('should display the description textarea', () => {
    const descriptionTextarea = fixture.nativeElement.querySelector(
      'textarea[formControlName="description"]'
    );
    expect(descriptionTextarea).toBeTruthy();
  });

  it('should display the dueDate input field', () => {
    const dueDateInput = fixture.nativeElement.querySelector(
      'input[formControlName="dueDate"]'
    );
    expect(dueDateInput).toBeTruthy();
  });

  it('should display the completed radio buttons', () => {
    const completedRadios = fixture.nativeElement.querySelectorAll(
      'input[formControlName="completed"]'
    );
    expect(completedRadios.length).toBe(2);
  });

  it('should call saveTask when addTask is called and id is null', fakeAsync(() => {
    spyOn(component, 'saveTask');
    mockTaskService.getTaskById.and.returnValue(
      of({
        data: {
          title: 'Mock Task',
          description: 'Mock Description',
          dueDate: '2023-01-01',
          completed: false,
        },
      })
    );
    component.taskForm.setValue({
      title: 'Updated Title',
      description: 'Updated',
      dueDate: new Date(),
      completed: false,
    });

    component.id = null;
    component.addTask();
    tick();
    expect(component.saveTask).toHaveBeenCalled();
  }));

  it('should call updateTask when addTask is called and id is not null', fakeAsync(() => {
    spyOn(component, 'updateTask');
    mockTaskService.getTaskById.and.returnValue(
      of({
        data: {
          title: 'Mock Task',
          description: 'Mock Description',
          dueDate: '2023-01-01',
          completed: false,
        },
      })
    );
    component.taskForm.setValue({
      title: 'Updated Title',
      description: 'Updated',
      dueDate: new Date(),
      completed: false,
    });

    component.id = 2;
    component.addTask();
    tick();
    expect(component.updateTask).toHaveBeenCalled();
  }));
});
