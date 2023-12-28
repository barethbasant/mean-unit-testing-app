import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'taskStatus',
})
export class TaskStatusPipe implements PipeTransform {
  transform(completed: boolean): string {
    return completed ? 'Completed' : 'Pending';
  }
}
