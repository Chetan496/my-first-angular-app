import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { TaskService } from '../../services/task.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Task } from '../../models/task';
import { CommonModule } from '@angular/common';
import { TaskItemComponent } from '../task-item/task-item.component';

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
export class TaskFormComponent implements OnInit, OnChanges{

  @Input() taskToEdit: Task | null = null;
  isEditMode = false;
  
  taskForm!: FormGroup; 

  priorities: ('low' | 'medium' | 'high')[] = ['low', 'medium', 'high'];

  constructor(private formBuilder: FormBuilder,  private taskService: TaskService) {
    
  }

  
  ngOnInit(): void {
    this.initForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['taskToEdit'].currentValue) {
      this.isEditMode = true;
      this.populateForm(changes['taskToEdit'].currentValue);
      
    }
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

      if (this.isEditMode){
        const updatedTask: Task = {
          ...this.taskToEdit!,
          title: this.taskForm.value.title,
          description: this.taskForm.value.description,
          priority: this.taskForm.value.priority,
          completed: this.taskForm.value.completed,
          updatedAt: new Date()
        };
        this.taskService.updateTask(updatedTask);
        this.resetForm();
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
      this.resetForm();
      }
    } else {
      Object.keys(this.taskForm.controls).forEach(key => {
        this.taskForm.get(key)?.markAsTouched();
      });
    }
  }


  resetForm() {
    this.taskForm.reset({
      title: '',
      description: '',
      priority: 'medium',
      completed: false
    });
    this.isEditMode = false;
    this.taskToEdit = null;
  }

  cancelEdit(): void {
    this.resetForm();
  }

}
