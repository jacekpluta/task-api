import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { DUPLICATE_USERNAME } from 'src/error-codes';
import { EntityRepository, Repository } from 'typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { GetUsersFilterDto } from './dto/get-users-filter.dto';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from './jwt-payload.interface';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<string> {
    const { username, password, email } = authCredentialsDto;

    const user = new User();

    user.username = username;
    user.salt = await bcrypt.genSalt();
    user.password = await this.hashPassword(password, user.salt);
    user.email = email;
    user.createdDate = new Date();

    try {
      await user.save();
    } catch (err) {
      if (err.code === DUPLICATE_USERNAME) {
        throw new ConflictException('Username or email already exists');
      } else {
        throw new InternalServerErrorException(err);
      }
    }

    return `User ${username} has been created`;
  }

  async validateUserPassword(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<JwtPayload> {
    const { username, password, email } = authCredentialsDto;

    const userNameEmail = { username: username, email: email };

    const user = await this.findOne({
      where: userNameEmail,
    });

    if (user && (await user.ValidatePassword(password))) {
      return userNameEmail;
    }

    return null;
  }

  private async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }

  async getUsers(filterDto: GetUsersFilterDto): Promise<User[]> {
    const { search } = filterDto;
    const query = this.createQueryBuilder('user');

    if (search) {
      query.andWhere(
        '(user.username LIKE :search OR user.email LIKE :search )',
        { search: `%${search}%` },
      );
    }

    return await query.getMany();
  }
}
