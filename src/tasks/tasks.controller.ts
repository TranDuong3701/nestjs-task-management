import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Logger,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from 'src/auth/user.entity';
import { CreateTaskDto } from './dtos/create-task.dto';
import { FilterTasksDto } from './dtos/filter-tasks.dto';
import { UpdateTaskDto } from './dtos/update-task.dto';
import { Task } from './task.entity';
import { TasksService } from './tasks.service';

@Controller('api/v1/tasks')
@UseGuards(AuthGuard())
export class TasksController {
  constructor(private tasksService: TasksService) {}
  private logger = new Logger('TasksController');
  @Get()
  getAllTasks(
    @Query() query: FilterTasksDto,
    @GetUser() user: User,
  ): Promise<Task[]> {
    this.logger.verbose(
      `User "${user.username}" retrieving all tasks. Filters: ${JSON.stringify(
        query,
      )}`,
    );
    return this.tasksService.getAllTasks(query, user);
  }

  @Post()
  @HttpCode(201)
  createTask(
    @Body() task: CreateTaskDto,
    @GetUser() user: User,
  ): Promise<Task> {
    this.logger.verbose(
      `User "${user.username}" creating a new task. Data: ${JSON.stringify(
        task,
      )}`,
    );
    return this.tasksService.createTask(task, user);
  }

  @Get('/:id')
  getTask(@Param('id') id: string, @GetUser() user: User): Promise<Task> {
    return this.tasksService.getTask(id, user);
  }

  @Put('/:id')
  updateTask(
    @Param('id') id: string,
    @Body() task: UpdateTaskDto,
    @GetUser() user: User,
  ): Promise<Task> {
    return this.tasksService.updateTask(id, task.status, user);
  }

  @Delete('/:id')
  @HttpCode(204)
  deleteTask(@Param('id') id: string, @GetUser() user: User): Promise<void> {
    return this.tasksService.deleteTask(id, user);
  }
}
