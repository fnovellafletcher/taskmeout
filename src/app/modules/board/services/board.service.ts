import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ListDto } from '../models/list-dto';
import { TaskDto } from '../models/task-dto';
import { delay, flatMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export abstract class IBoardService {
  abstract getLists(): Observable<ListDto[]>;
  abstract createList(name: string): Observable<ListDto>;
  abstract modifyList(id: number, newName: string): Observable<any>;
  abstract deleteList(id: number): Observable<any>;

  abstract getTasks(): Observable<TaskDto[]>;
  abstract createTask(text: string, listId: number): Observable<TaskDto>;
  abstract modifyTask(id: number, text: string, listId: number): Observable<any>;
  abstract deleteTask(id: number): Observable<any>;
}

class RealBoardService extends IBoardService {
  private listEndpoint = environment.apihost + '/list';
  private tasksEndpoint = environment.apihost + '/tasks';
  private listTasksEndpoint = environment.apihost + '/list/tasks';

  constructor(private http: HttpClient) { super(); }

  getLists(): Observable<ListDto[]> {
    return this.http.get<ListDto[]>(this.listEndpoint);
  }

  createList(name: string): Observable<ListDto> {
    const data = {
      name: name
    };

    return this.http.post<ListDto>(this.listEndpoint, data);
  }

  modifyList(id: number, name: string): Observable<any> {
    const endpoint = this.listEndpoint + '/' + id;
    const data = {
      name: name
    };

    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json');

    return this.http.put<ListDto>(endpoint, data, { headers: headers });
  }

  deleteList(id: number): Observable<any> {
    const endpoint = this.listEndpoint + '/' + id;
    const deleteTasksEndpoint = this.listTasksEndpoint + '/' + id;

    // nest the observables here so it's transparent to the front
    return this.http.delete(deleteTasksEndpoint, { responseType: 'text' })
      .pipe(flatMap(result => this.http.delete<ListDto>(endpoint)));
  }

  getTasks(): Observable<TaskDto[]> {
    return this.http.get<TaskDto[]>(this.tasksEndpoint);
  }

  createTask(text: string, listId: number): Observable<TaskDto> {
    const data = {
      idlist: listId,
      task: text || ''
    };

    return this.http.post<TaskDto>(this.tasksEndpoint, data);
  }

  modifyTask(id: number, text: string, listId: number): Observable<any> {
    const endpoint = this.tasksEndpoint + '/' + id;
    const data = {
      task: text,
      listId: listId    // API not ready to change the listId of a task :(
    };

    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json');

    return this.http.put<any>(endpoint, data, { headers: headers });
  }

  deleteTask(id: number): Observable<any> {
    const endpoint = this.tasksEndpoint + '/' + id;

    return this.http.delete<any>(endpoint);
  }
}

class FakeBoardService extends IBoardService {

  private lists = [
    new ListDto(1, 1, 'Fake List 1', new Date(), new Date()),
    new ListDto(2, 2, 'Fake List 2', new Date(), new Date()),
    new ListDto(3, 3, 'Fake List 3', new Date(), new Date()),
  ];

  private tasks = [
    new TaskDto(1, 1, 'Fake Task 1 from List 1', new Date(), new Date()),
    new TaskDto(2, 1, 'Fake Task 2 from List 1', new Date(), new Date()),
    new TaskDto(3, 1, 'Fake Task 3 from List 1', new Date(), new Date()),
    new TaskDto(4, 2, 'Fake Task 1 from List 2', new Date(), new Date()),
    new TaskDto(5, 2, 'Fake Task 2 from List 2', new Date(), new Date()),
    new TaskDto(6, 2, 'Fake Task 3 from List 2', new Date(), new Date()),
  ];

  getLists(): Observable<ListDto[]> {
    return of(this.lists.slice(0)).pipe(delay(300));
  }

  createList(name: string): Observable<ListDto> {
    // get incremental id
    const nextId = this.lists.map(x => x.id).sort().reverse()[0] + 1;
    const newList = new ListDto(nextId, 1, name, new Date(), new Date());
    this.lists.push(newList);
    return of(newList).pipe(delay(300));
  }

  modifyList(id: number, newName: string): Observable<any> {
    const listElem = this.lists.find(x => x.id === id);
    if (!listElem) { throw new Error(`There is no list with id = ${id}.`); }
    listElem.name = newName;
    const filteredList = this.lists.filter(x => x.id !== id);
    filteredList.push(listElem);
    this.lists = filteredList;
    return of(true).pipe(delay(300));
  }

  deleteList(id: number): Observable<any> {
    this.lists = this.lists.filter(x => x.id !== id);
    return of(true).pipe(delay(300));
  }

  getTasks(): Observable<TaskDto[]> {
    return of(this.tasks.slice(0)).pipe(delay(300));
  }

  createTask(text: string, listId: number): Observable<TaskDto> {
    // get incremental id
    const nextId = this.tasks.map(x => x.id).sort().reverse()[0] + 1;
    const newTask = new TaskDto(nextId, listId, text, new Date(), new Date());
    const newTasks = this.tasks;
    newTasks.unshift(newTask);
    this.tasks = newTasks;
    return of(newTask).pipe(delay(300));
  }

  modifyTask(id: number, text: string, listId: number): Observable<any> {
    const taskElem = this.tasks.find(x => x.id === id);
    if (!taskElem) { throw new Error(`There is no task with id = ${id}.`); }
    taskElem.task = text;
    taskElem.idlist = listId;
    const filteredTasks = this.tasks.filter(x => x.id !== id);
    filteredTasks.push(taskElem);
    this.tasks = filteredTasks;
    return of(true).pipe(delay(300));
  }

  deleteTask(id: number) {
    this.tasks = this.tasks.filter(x => x.id !== id);
    return of(true).pipe(delay(300));
  }
}

export const boardFactory = (httpClient: HttpClient) =>
  environment.fakeApi ? new FakeBoardService() : new RealBoardService(httpClient);