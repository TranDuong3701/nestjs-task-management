import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dtos/create-task.dto';
import { Task, TaskStatus } from './task.model';
import { v4 as uuid } from 'uuid';
import { FilterTasksDto } from './dtos/filter-tasks.dto';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  getAllTasks(): Task[] {
    return this.tasks;
  }

  getTasksWithFilter(filter: FilterTasksDto): Task[] {
    let tasks = this.getAllTasks();
    if (filter.status) {
      tasks = this.tasks.filter((t) => t.status === filter.status);
    }

    if (filter.search) {
      tasks = this.tasks.filter((t) => {
        return (
          t.title.includes(filter.search) ||
          t.description.includes(filter.search)
        );
      });
    }

    return tasks;
  }
  getTask(id: string): Task {
    const task = this.tasks.find((task) => task.id === id);
    if (!task) throw new NotFoundException('Task not found');
    return task;
  }

  createTask(data: CreateTaskDto): Task {
    const task: Task = {
      id: uuid(),
      title: data.title,
      description: data.description,
      status: TaskStatus.OPEN,
    };
    this.tasks.push(task);
    return task;
  }

  updateTask(id: string, status: TaskStatus): Task {
    const task = this.getTask(id);
    task.status = status;
    return task;
  }

  deleteTask(id: string): void {
    const task = this.getTask(id);

    this.tasks = this.tasks.filter((task) => task.id !== id);
  }
}
