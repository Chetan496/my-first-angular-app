import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Task } from '../../models/task';

@Component({
  selector: 'app-task-item',
  standalone: true,
  imports: [],
  templateUrl: './task-item.component.html',
  styleUrl: './task-item.component.css'
})
export class TaskItemComponent  implements OnInit {
 
  @Input('task') task: Task  | undefined;
  @Output() editTask = new EventEmitter<Task>();

  ngOnInit(): void {
    
  }

  onEdit(): void {
    if (this.task) {
      this.editTask.emit(this.task);
    }
  }

}
