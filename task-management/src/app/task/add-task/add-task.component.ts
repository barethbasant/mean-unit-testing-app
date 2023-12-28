import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable, map } from 'rxjs';
import { Task } from 'src/app/shared/model/task';
import { TaskService } from 'src/app/task.service';

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.css'],
})
export class AddTaskComponent implements OnInit {
  taskForm: FormGroup;
  formattedDate;
  id: any = null;
  btnName = 'Add';
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private taskService: TaskService,
    private router: Router
  ) {
    const currentDate = new Date();

    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    this.formattedDate = `${year}-${month}-${day}`;

    this.taskForm = this.formBuilder.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      dueDate: [this.formattedDate, Validators.required],
      completed: ['false', Validators.required],
    });
  }

  ngOnInit() {
    this.route.params.subscribe((param: Params) => {
      if (param['id']) {
        this.id = +param['id'];
        this.getTaskById(this.id);
        this.btnName = 'Update';
      }
    });
  }

  getTaskById(id: number) {
    this.taskService
      .getTaskById(id)
      .pipe(
        map((el: any) => ({
          title: el?.data.title,
          description: el.data.description,
          dueDate: el.data.dueDate,
          completed: el.data.completed.toString(),
        }))
      )
      .subscribe((task) => {
        this.taskForm.patchValue(task);
      });
  }

  resetForm() {
    this.taskForm.reset();
    this.taskForm.patchValue({
      completed: 'false',
      dueDate: this.formattedDate,
    });
  }

  addTask() {
    this.markFormGroupAsTouched(this.taskForm);
    if (this.taskForm.valid) {
      const newTask: Task = this.taskForm.value as Task;
      this.id ? this.updateTask(newTask) : this.saveTask(newTask);
    }
  }

  saveTask(newTask: Task) {
    this.taskService.addTask(newTask).subscribe(
      (data: any) => {
        this.toastr.success(data.message, 'Success');
        this.resetForm();
      },
      (err) => {
        this.toastr.error(err.error.message, 'Error');
      }
    );
  }

  updateTask(task: Task) {
    this.taskService.updateTask(task, this.id).subscribe(
      (data: any) => {
        this.toastr.success(data.message, 'Success');
        this.resetForm();
      },
      (err) => {
        this.toastr.error(err.error.message, 'Error');
      }
    );
  }

  private markFormGroupAsTouched(formGroup: FormGroup | FormArray) {
    Object.values(formGroup.controls).forEach((control) => {
      if (control instanceof FormGroup || control instanceof FormArray) {
        this.markFormGroupAsTouched(control);
      } else {
        control.markAsTouched();
      }
    });
  }

  hasError(controlName: string, errorName: string) {
    return this.taskForm?.get(controlName)?.hasError(errorName);
  }

  listTask() {
    this.router.navigate(['/']);
  }
}
