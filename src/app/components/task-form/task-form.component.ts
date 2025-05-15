import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { TaskService } from '../../services/task.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Task } from '../../models/task';
import { CommonModule } from '@angular/common';
import { TaskItemComponent } from '../task-item/task-item.component';
import { ActivatedRoute, Router } from '@angular/router';

/*
Using reactive forms we have to allow the user to add task details
We need to have some validatations on the fields.
title and description should be mandatory 
priority should be mandatory and should be one of the following values: low, medium, high
We need to inject the TaskService to add the task to the list of tasks

*/

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.css'
})
export class TaskFormComponent implements OnInit{

  taskBeingEdited: Task | undefined = undefined;
  isEditMode = false;
  taskId: number | null = null;  
  taskForm!: FormGroup; 
  priorities: ('low' | 'medium' | 'high')[] = ['low', 'medium', 'high'];

  constructor(private formBuilder: FormBuilder,  private taskService: TaskService, private router: Router, private route: ActivatedRoute) {    
  }

  
  ngOnInit(): void {
    this.initForm();
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.taskId = +params['id']; // Convert to number
        this.taskBeingEdited = this.taskService.getTaskById(this.taskId);
        
        if (this.taskBeingEdited) {
          this.isEditMode = true;
          this.populateForm(this.taskBeingEdited);
        } else {
          // Task not found, redirect to tasks list
          this.router.navigate(['/tasks']);
        }
      }
    });

  }



  initForm(): void {
    this.taskForm = this.formBuilder.group({
      title: ['', Validators.required ],
      description: ['', Validators.required ],
      priority: ['medium', Validators.required ]
    });
  }

  populateForm(task: Task) : void {
    this.taskForm.patchValue({
      id: task.id,
      title: task.title,
      description: task.description,
      priority: task.priority,
      completed: task.completed
    });    
  }


  onSubmit(): void {
    if (this.taskForm.valid) {

      if (this.isEditMode && this.taskId ){
        const updatedTask: Task = {
          ...this.taskBeingEdited!,
          title: this.taskForm.value.title,
          description: this.taskForm.value.description,
          priority: this.taskForm.value.priority,
          completed: this.taskForm.value.completed,
          updatedAt: new Date()
        };
        this.taskService.updateTask(updatedTask);
        this.router.navigate(['/tasks']);
      } else {
      const dt: Date = new Date();
      const newTask: Task = {
        id: Math.floor(Math.random() * 1000000),
        title: this.taskForm.value.title,
        description: this.taskForm.value.description,
        priority: this.taskForm.value.priority,
        completed: false,
        createdAt: dt,
        updatedAt: dt
      };

      this.taskService.addTask(newTask);
      this.router.navigate(['/tasks']);
      }
    } else {
      Object.keys(this.taskForm.controls).forEach(key => {
        this.taskForm.get(key)?.markAsTouched();
      });
    }
  }


  cancelEdit(): void {
    this.router.navigate(['/tasks']);
  }

}
