import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IToDoItem } from './todo.interface';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  title = 'todo-client';

  public todos: IToDoItem[] = [];

  frm: FormGroup;

  constructor(
    private http: HttpClient,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.frm = this.fb.group({
      title: ['new todo', [Validators.required]]
    });

    this.getTodos();
  }

  getTodos() {
    this.http.get('http://localhost:5000/todo')
      .subscribe((res: { data: IToDoItem, errors: string[]}[]) => {
        console.log(res);
        this.todos = res.map(r => r.data);
      });
  }

  addTodo({ value }) {
    console.log(value);
    this.http.post('http://localhost:5000/todo', value, {
      headers: new HttpHeaders({
        'content-type': 'application/json',
        'access-control-allow-origin': '*'
      })
    })
      .subscribe(res => {
        console.log(res);
        this.getTodos();
      });
  }

  updateTodo($event: MatCheckboxChange, todo: IToDoItem) {
    console.log('update todo', todo);
    todo.done = $event.checked;
    this.http.put('http://localhost:5000/todo', todo)
      .subscribe(res => {
        console.log(res);
        this.getTodos();
      });
  }

}
