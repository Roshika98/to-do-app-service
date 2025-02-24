import { IsDateString, IsOptional, IsString } from 'class-validator';

export class UpdateTaskDto {
  @IsString()
  @IsOptional()
  title: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsDateString()
  @IsOptional()
  dueDate: Date;

  @IsString()
  @IsOptional()
  status: 'PENDING' | 'DONE';
}
