import { FilterTasksDto } from './dtos/filter-tasks.dto';
import { EntityRepository, Repository } from 'typeorm';
import { CreateTaskDto } from './dtos/create-task.dto';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';

@EntityRepository(Task)
export class TasksRepository extends Repository<Task> {
  async getAllTasks(filter: FilterTasksDto): Promise<Task[]> {
    const query = this.createQueryBuilder('task');

    const {status, search}= filter;
    if(status)
        query.andWhere('task.status = :status', {status})
    if(search)
        query.andWhere('LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search)', {search: `%${search}%`})
    const tasks = await query.getMany();
    return tasks;
  }

  async createTask(data: CreateTaskDto): Promise<Task> {
    const { title, description } = data;
    const task = this.create({
      title,
      description,
      status: TaskStatus.OPEN,
    });
    await this.save(task);
    return task;
  }
}
