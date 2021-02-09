import { IsDate, Length } from 'class-validator';

export class CreateTaskDto {
  @Length(3, 99)
  title: string;

  @Length(0, 99)
  description: string;

  // @IsDate()
  createDate: Date;
}
