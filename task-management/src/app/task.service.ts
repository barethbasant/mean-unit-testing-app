import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Task } from './shared/model/task';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  readonly url = environment.APIURL;
  constructor(private http: HttpClient) {}

  getTasks() {
    return this.http.get(`${this.url}/task`);
  }

  getTaskById(id: number) {
    return this.http.get(`${this.url}/task/${id}`);
  }

  addTask(data: Task) {
    return this.http.post(`${this.url}/task`, data);
  }

  updateTask(data: Task, id: number) {
    return this.http.put(`${this.url}/task/${id}`, data);
  }

  deleteTask(id: number) {
    return this.http.delete(`${this.url}/task/${id}`);
  }
}
