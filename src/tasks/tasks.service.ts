import { Task } from './task.entity';
import { TasksRepository } from './tasks.repository';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dtos/create-task.dto';
import {  TaskStatus } from './task-status.enum';
import { FilterTasksDto } from './dtos/filter-tasks.dto';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TasksRepository)
    private tasksRepository: TasksRepository,
  ) {}

  getAllTasks(filter: FilterTasksDto ): Promise<Task[]> {
    return this.tasksRepository.getAllTasks(filter);
  }
  
  async getTask(id: string): Promise<Task> {
    const task = await this.tasksRepository.findOne(id);

    if (!task) 
      throw new NotFoundException(`Task with ID "${id}" not found`);

    return task;
  }

  async createTask(data: CreateTaskDto): Promise<Task> {
   return this.tasksRepository.createTask(data);
  }

  async updateTask(id: string, status: TaskStatus): Promise<Task> {
    const task = await this.getTask(id);
    task.status = status;
    await this.tasksRepository.save(task);
    return task;
  }

  async deleteTask(id: string): Promise<void> {
    const {affected} = await this.tasksRepository.delete(id);
    if(!affected) throw new NotFoundException()
  }
}
