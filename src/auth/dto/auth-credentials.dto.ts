import {
  IsEmail,
  IsOptional,
  IsString,
  Length,
  Matches,
} from 'class-validator';

export class AuthCredentialsDto {
  @IsOptional()
  @IsString()
  @Length(3, 50)
  username: string;

  @IsEmail()
  @Length(5, 50)
  email: string;

  // @Matches(/((?=.*\d)|(?=.*\W+))(?![.n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
  //   message: 'Password too weak',
  // })

  @IsString()
  @Length(6, 50)
  password: string;
}
