import { Component, OnInit } from '@angular/core';
import { TaskService } from '../../services/task.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Task } from '../../models/task';
import { CommonModule } from '@angular/common';

/*
Using reactive forms we have to allow the user to add task details
We need to have some validatations on the fields.
title and description should be mandatory 
priority should be mandatory and should be one of the following values: low, medium, high
We need to inject the TaskService to add the task to the list of tasks

*/

@Component({
  selector: 'app-task-form',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.css'
})
export class TaskFormComponent implements OnInit{

  taskForm!: FormGroup; 

  priorities: ('low' | 'medium' | 'high')[] = ['low', 'medium', 'high'];

  constructor(private formBuilder: FormBuilder,  private taskService: TaskService) {
    
  }

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.taskForm = this.formBuilder.group({
      title: ['', Validators.required ],
      description: ['', Validators.required ],
      priority: ['medium', Validators.required ]
    });
  }

  onSubmit(): void {
    if (this.taskForm.valid) {
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
      this.taskForm.reset({
        title: '',
        description: '',
        priority: 'medium'
      });
    } else {
      Object.keys(this.taskForm.controls).forEach(key => {
        this.taskForm.get(key)?.markAsTouched();
      });
    }
  }




}
