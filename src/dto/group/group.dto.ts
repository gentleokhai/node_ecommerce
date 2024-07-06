import { IsString, IsNotEmpty } from 'class-validator';
import { CreateGroup } from './types';

export class CreateGroupValidationSchema implements CreateGroup {
  @IsString()
  @IsNotEmpty()
  name!: string;
}
