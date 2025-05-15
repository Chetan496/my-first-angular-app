import { Injectable } from '@angular/core';
import { Task } from '../models/task';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskService {


  private tasks: Task[] = [];

  private tasksSubject = new BehaviorSubject<Task[]>([]);

  constructor() { 

    this.addTask({
      title: 'Learn Angular Components',
      description: 'Study how components work in Angular',
      priority: 'high'
    });
    this.addTask({
      title: 'Understand Services',
      description: 'Learn how services and dependency injection work',
      priority: 'medium'
    });    

  }

  getTasks(): Observable<Task[]> {
    return this.tasksSubject.asObservable();
  }

  addTask(taskData: Partial<Task>): void {
    const curDate: Date = new Date()
    const task: Task = {
      id:  Math.floor(Math.random() * 100000000) + 1,
      title: taskData.title || '',
      description: taskData.description || '',
      completed: false,
      priority: taskData.priority || 'medium',
      createdAt: curDate,
      updatedAt: curDate
    };
    
    this.tasks = [...this.tasks, task];
    this.tasksSubject.next(this.tasks);
  }

  updateTask(updatedTask: Task): void {
    this.tasks = this.tasks.map(task => 
      task.id === updatedTask.id ? updatedTask : task
    );
    this.tasksSubject.next(this.tasks);
  }

  deleteTask(id: number): void {
    this.tasks = this.tasks.filter(task => task.id !== id);
    this.tasksSubject.next(this.tasks);
  }


  toggleTaskCompletion(id: number): void {
    this.tasks = this.tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    this.tasksSubject.next(this.tasks);
  }

  getTaskById(taskId: number) : Task | undefined {
    return this.tasks.find(task => task.id === taskId);
  }

}
