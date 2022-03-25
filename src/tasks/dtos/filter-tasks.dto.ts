import { IsEnum, IsOptional, IsString } from 'class-validator';
import { TaskStatus } from '../task.model';

export class FilterTasksDto {
  @IsEnum(TaskStatus)
  @IsOptional()
  status?: string;

  @IsOptional()
  @IsString()
  search?: string;
}
