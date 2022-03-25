import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { CreateTaskDto } from './dtos/create-task.dto';
import { FilterTasksDto } from './dtos/filter-tasks.dto';
import { Task, TaskStatus } from './task.model';
import { TasksService } from './tasks.service';

@Controller('api/v1/tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get()
  getAllTasks(@Query() query: FilterTasksDto): Task[] {
    if (query) return this.tasksService.getTasksWithFilter(query);

    return this.tasksService.getAllTasks();
  }

  @Post()
  @HttpCode(201)
  createTask(@Body() task: CreateTaskDto): Task {
    return this.tasksService.createTask(task);
  }

  @Get('/:id')
  getTask(@Param('id') id: string): Task {
    return this.tasksService.getTask(id);
  }

  @Put('/:id')
  updateTask(
    @Param('id') id: string,
    @Body('status') status: TaskStatus,
  ): Task {
    return this.tasksService.updateTask(id, status);
  }

  @Delete('/:id')
  @HttpCode(204)
  deleteTask(@Param('id') id: string): void {
    return this.tasksService.deleteTask(id);
  }
}
