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
  
  constructor(private router: Router) {}

  ngOnInit(): void {
    
  }

  onEdit(): void {
    if (this.task) {
      this.router.navigate(['/edit-task', this.task.id]);
    }
  }

}
