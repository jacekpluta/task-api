import { IsNotEmpty, IsOptional } from 'class-validator';

export class GetUsersFilterDto {
  @IsOptional()
  @IsNotEmpty()
  search: string;
}
