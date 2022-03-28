import { Task } from './task.entity';
import { TasksRepository } from './tasks.repository';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dtos/create-task.dto';
import { TaskStatus } from './task-status.enum';
import { FilterTasksDto } from './dtos/filter-tasks.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/user.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TasksRepository)
    private tasksRepository: TasksRepository,
  ) {}

  getAllTasks(filter: FilterTasksDto, user: User): Promise<Task[]> {
    return this.tasksRepository.getAllTasks(filter, user);
  }

  async getTask(id: string, user: User): Promise<Task> {
    const task = await this.tasksRepository.findOne({ id, user });

    if (!task) throw new NotFoundException(`Task with ID "${id}" not found`);

    return task;
  }

  async createTask(task: CreateTaskDto, user: User): Promise<Task> {
    return this.tasksRepository.createTask(task, user);
  }

  async updateTask(id: string, status: TaskStatus, user: User): Promise<Task> {
    const task = await this.getTask(id, user);
    task.status = status;
    await this.tasksRepository.save(task);
    return task;
  }

  async deleteTask(id: string, user: User): Promise<void> {
    const { affected } = await this.tasksRepository.delete({ id, user });
    if (!affected) throw new NotFoundException();
  }
}
