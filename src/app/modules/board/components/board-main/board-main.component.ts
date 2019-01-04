import { Component, OnInit, OnDestroy, ViewChild, TemplateRef, ChangeDetectionStrategy } from '@angular/core';
import { IAuthService } from 'src/app/shared/services/auth.service';
import { Router } from '@angular/router';
import { Subscription, of } from 'rxjs';
import { ListDto } from '../../models/list-dto';
import { TaskDto } from '../../models/task-dto';
import { IBoardService } from '../../services/board.service';
import { flatMap, switchMap } from 'rxjs/operators';
import { MatDialog } from '@angular/material';
import { CdkDragDrop } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-board-main',
  templateUrl: './board-main.component.html',
  styleUrls: ['./board-main.component.scss']
})
export class BoardMainComponent implements OnInit, OnDestroy {

  lists: ListDto[];
  tasks: TaskDto[];

  loading = true;

  selectedList: ListDto;
  @ViewChild('deleteListConfirmationDialog') dialogTemplate: TemplateRef<any>;

  authSub: Subscription;
  loadSub: Subscription;

  constructor(
    private authService: IAuthService,
    private router: Router,
    private boardService: IBoardService,
    private dialog: MatDialog) { }

  ngOnInit() {
    // send to /login if user is not authenticated
    this.authSub = this.authService.isLogged().subscribe(isLogged => {
      if (!isLogged) {
        this.router.navigateByUrl('/login');
      }
    });

    // load lists and tasks from their separate methods in our service
    this.loadSub = this.boardService.getLists()
      .pipe(switchMap(lists => {
        this.lists = lists;
        return this.boardService.getTasks();
      }))
      .subscribe(tasks => {
        this.tasks = tasks;
        this.loading = false;
      });
  }

  ngOnDestroy() {
    this.authSub.unsubscribe();
    this.loadSub.unsubscribe();
  }

  getTasksFromList(listId: number): TaskDto[] {
    if (!this.tasks) { return []; }

    return this.tasks.filter(x => x.idlist === listId);
  }

  addNewList() {
    this.loading = true;
    this.boardService.createList(undefined)
      .pipe(flatMap(result => of(result)))
      .subscribe(result => {
        this.lists.push(result);
        this.loading = false;
      });
  }

  modifyList(listId: number, $event: Event) {
    const htmlTarget = ($event.target) as HTMLInputElement;
    const text = htmlTarget.value;

    this.loading = true;
    this.boardService.modifyList(listId, text)
      .pipe(flatMap(result => of(result)))
      .subscribe(result => this.loading = false);
  }

  addTaskToList(listId: number, $event: Event) {
    this.loading = true;
    this.boardService.createTask(undefined, listId)
      .subscribe(result => {
        this.tasks.unshift(result);
        this.loading = false;
      });
    // optimistic approach. Trust the service and assume it has done its work properly
    // and add the task manually without consuming the service again.
  }

  modifyTaskText(taskId: number, $event: Event, idlist: number) {
    const htmlTarget = ($event.target) as HTMLInputElement;
    const task = htmlTarget.value;

    this.loading = true;
    this.boardService.modifyTask(taskId, task, idlist)
      .subscribe(result => {
        this.loading = false;
        const taskToModify = this.tasks.find(x => x.id === taskId);
        taskToModify.task = task;
      });
  }

  taskDropped(listId: number, $event: CdkDragDrop<TaskDto[]>) {
    const data = $event.item.data as TaskDto;
    if (!data) { return; }

    // do nothing, API does not order tasks inside a list
    if (data.idlist === listId) { return; }

    this.loading = true;
    this.boardService.modifyTask(data.id, data.task, listId)
      .pipe(flatMap(result => of(result)))
      .subscribe(result => {
        this.loading = false;

        const taskToModify = this.tasks.find(x => x.id === data.id);
        taskToModify.idlist = listId;
        const newTasks = this.tasks.filter(x => x.id !== data.id);
        newTasks.push(taskToModify);
        this.tasks = newTasks;
      });
  }

  deleteTask(taskId: number, $event: Event) {
    $event.stopPropagation();
    this.loading = true;
    this.boardService.deleteTask(taskId)
      .pipe(flatMap(result => of(result)))
      .subscribe(result => {
        this.loading = false;

        const newTasks = this.tasks.filter(x => x.id !== taskId);
        this.tasks = newTasks;
      });
  }

  showDeleteListDialog(listId: number) {
    this.selectedList = this.lists.find(x => x.id === listId);
    if (!this.selectedList) { return; }

    const dialog = this.dialog.open(this.dialogTemplate);

    dialog.afterClosed().subscribe(result => {
      this.selectedList = undefined;
    });
  }

  countTasks(listId: number) {
    return this.tasks.filter(x => x.idlist === listId).length;
  }

  deleteList(listId: number, $event: Event) {

    this.loading = true;
    this.boardService.deleteList(listId)
      .pipe(flatMap(result => this.boardService.getLists()))
      .subscribe(result => {
        this.lists = result;
        this.loading = false;
      });
    // pesimistic approach. DON'T trust the service and request all lists again, 
    // eventhough we could just remove this.selectedList from our array..
  }
}
