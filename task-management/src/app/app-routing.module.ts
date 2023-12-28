import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TaskListComponent } from './task/task-list/task-list.component';
import { AddTaskComponent } from './task/add-task/add-task.component';
import { AuthguardGuard } from './auth.guard';

const routes: Routes = [
  {
    path: 'login',
    loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: 'tasks/list',
    component: TaskListComponent,
    canActivate: [AuthguardGuard],
  },
  {
    path: 'tasks/add',
    component: AddTaskComponent,
    canActivate: [AuthguardGuard],
  },
  {
    path: 'tasks/:id/edit',
    component: AddTaskComponent,
    canActivate: [AuthguardGuard],
  },
  {
    path: '',
    redirectTo: 'tasks/list',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
