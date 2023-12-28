import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskListComponent } from './task-list/task-list.component';
import { AddTaskComponent } from './add-task/add-task.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HighlightDirective } from '../shared/highlight.directive';
import { TaskStatusPipe } from './task-status.pipe';

@NgModule({
  declarations: [TaskListComponent, AddTaskComponent,HighlightDirective, TaskStatusPipe],
  imports: [CommonModule, ReactiveFormsModule],
})
export class TaskModule {}
