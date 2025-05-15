import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Task } from '../../models/task';
import { Router } from '@angular/router';

@Component({
  selector: 'app-task-item',
  standalone: true,
  imports: [],
  templateUrl: './task-item.component.html',
  styleUrl: './task-item.component.css'
})
export class TaskItemComponent  implements OnInit {
 
  @Input('task') task: Task  | undefined;

  @Output() deleteTask = new EventEmitter<number>();
  
  constructor(private router: Router) {}

  ngOnInit(): void {
    
  }

  onEdit(): void {
    if (this.task) {
      this.router.navigate(['/edit-task', this.task.id]);
    }
  }

  onDelete(): void {
    if (this.task) {
      console.log("deleting task with id", this.task.id);
      this.deleteTask.emit(this.task.id);
    }
  }

}
