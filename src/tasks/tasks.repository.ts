import { FilterTasksDto } from './dtos/filter-tasks.dto';
import { EntityRepository, Repository } from 'typeorm';
import { CreateTaskDto } from './dtos/create-task.dto';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';
import { User } from 'src/auth/user.entity';
import { InternalServerErrorException, Logger } from '@nestjs/common';

@EntityRepository(Task)
export class TasksRepository extends Repository<Task> {
  private logger = new Logger('TasksRepository');

  async getAllTasks(filter: FilterTasksDto, user: User): Promise<Task[]> {
    const query = this.createQueryBuilder('task');

    const { status, search } = filter;
    query.where({ user });

    if (status) query.andWhere('task.status = :status', { status });

    if (search)
      query.andWhere(
        '(LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search)',
        { search: `%${search}%)` },
      );

    try {
      const tasks = await query.getMany();
      return tasks;
    } catch (error) {
      this.logger.error(
        `Failed to get tasks by user "${
          user.username
        }". Filters: ${JSON.stringify(filter)}`,
        error.stack,
      );
      throw new InternalServerErrorException();
    }
  }

  async createTask(data: CreateTaskDto, user: User): Promise<Task> {
    const { title, description } = data;
    const task = this.create({
      title,
      description,
      status: TaskStatus.OPEN,
      user,
    });
    await this.save(task);
    return task;
  }
}
