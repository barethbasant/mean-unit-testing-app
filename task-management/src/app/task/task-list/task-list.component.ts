import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs';
import { Task } from 'src/app/shared/model/task';
import { TaskService } from 'src/app/task.service';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css'],
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];

  constructor(
    private taskService: TaskService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getTasks();
  }

  getTasks() {
    const tasksObservable = this.taskService.getTasks();

    if (tasksObservable) {
      tasksObservable
        .pipe(map((el: any) => el.data))
        .subscribe((data: Task[]) => {
          this.tasks = data;
        });
    }
  }
  addTask(): void {
    this.router.navigate(['tasks', 'add']);
  }

  editTask(task: Task): void {
    this.router.navigate(['tasks', task.id, 'edit']);
  }

  deleteTask(task: Task): void {
    if (!task.id) {
      return;
    }

    this.taskService.deleteTask(task.id).subscribe(
      (data: any) => {
        this.getTasks();
        this.toastr.success(data.message, 'Success');
      },
      (err) => {
        this.toastr.error(err.error.message, 'Error');
      }
    );
  }
}
