import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { GetUsersFilterDto } from './dto/get-users-filter.dto';
import { JwtPayload } from './jwt-payload.interface';
import { User } from './user.entity';
import { UserRepository } from './user.repository';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async getUserById(id: number): Promise<User> {
    const userFound = await this.userRepository.findOne(id);

    if (!userFound) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }
    return userFound;
  }

  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<string> {
    return this.userRepository.signUp(authCredentialsDto);
  }

  async signIn(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    const user = await this.userRepository.validateUserPassword(
      authCredentialsDto,
    );

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    console.log(user);
    const accessToken = await this.jwtService.sign(user);
    return { accessToken };
  }

  async getUsers(filterDto: GetUsersFilterDto): Promise<User[]> {
    const users = await this.userRepository.getUsers(filterDto);

    return users;
  }

  //   async changeUserData(id: number, data: CreateUserDto): Promise<User> {
  //     const task = await this.getUserById(id);
  //     task.status = status;

  //     await task.save(task);
  //     return task;
  //   }

  async deleteUserById(id: number): Promise<string> {
    const result = await this.userRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }

    return `User with ID "${id}" deleted`;
  }
}
