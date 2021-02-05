import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { GetUsersFilterDto } from './dto/get-users-filter.dto';
import { User } from './user.entity';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get()
  getUsers(
    @Query(ValidationPipe) filterDto: GetUsersFilterDto,
  ): Promise<User[]> {
    return this.authService.getUsers(filterDto);
  }

  @Get('/user/:id')
  @UseGuards(AuthGuard())
  getUserById(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return this.authService.getUserById(id);
  }

  @Post('/signup')
  @UsePipes(ValidationPipe)
  signUp(@Body() createUserDto: AuthCredentialsDto): Promise<string> {
    return this.authService.signUp(createUserDto);
  }

  @Post('/signin')
  @UsePipes(ValidationPipe)
  signIn(
    @Body() createUserDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    return this.authService.signIn(createUserDto);
  }

  @Delete('/:id')
  deleteUserById(@Param('id', ParseIntPipe) id: number): Promise<string> {
    return this.authService.deleteUserById(id);
  }

  //   @Patch('/:id/status')
  //   changeTaskStatus(
  //     @Param('id', ParseIntPipe) id: number,
  //     @Body('status', new TaskStatusValidationPipe()) status: TaskStatus,
  //   ): Promise<Task> {
  //     return this.tasksService.changeTaskStatus(id, status);
  //   }
}
