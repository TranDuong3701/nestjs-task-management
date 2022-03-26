import { IsEnum, IsOptional, IsString } from 'class-validator';
import { TaskStatus } from '../task-status.enum';

export class FilterTasksDto {
  @IsEnum(TaskStatus)
  @IsOptional()
  status?: string;

  @IsOptional()
  @IsString()
  search?: string;
}
