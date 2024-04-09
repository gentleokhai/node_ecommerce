import { IsString, IsNotEmpty } from 'class-validator';
import { CreateJob } from './types';

export class CreateJobValidationSchema implements CreateJob {
  @IsString()
  @IsNotEmpty()
  name!: string;
}
