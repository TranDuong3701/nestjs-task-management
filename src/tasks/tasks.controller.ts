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
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateTaskDto } from './dtos/create-task.dto';
import { FilterTasksDto } from './dtos/filter-tasks.dto';
import { UpdateTaskDto } from './dtos/update-task.dto';
import { Task } from './task.entity';
import { TasksService } from './tasks.service';

@Controller('api/v1/tasks')
@UseGuards(AuthGuard())
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get()
  getAllTasks(@Query() query: FilterTasksDto): Promise<Task[]> {
    return this.tasksService.getAllTasks(query);
  }

  @Post()
  @HttpCode(201)
  createTask(@Body() task: CreateTaskDto): Promise<Task> {
    return this.tasksService.createTask(task);
  }

  @Get('/:id')
  getTask(@Param('id') id: string): Promise<Task> {
    return this.tasksService.getTask(id);
  }

  @Put('/:id')
  updateTask(
    @Param('id') id: string,
    @Body() task: UpdateTaskDto,
  ): Promise<Task> {
    return this.tasksService.updateTask(id, task.status);
  }

  @Delete('/:id')
  @HttpCode(204)
  deleteTask(@Param('id') id: string): Promise<void> {
    return this.tasksService.deleteTask(id);
  }
}
