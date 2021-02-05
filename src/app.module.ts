import { Module } from '@nestjs/common';
import { TasksModule } from './tasks/tasks.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configService } from './config/typeorm.config';
import { EasyconfigModule } from 'nestjs-easyconfig';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    EasyconfigModule.register({ path: './.env' }),
    TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
    TasksModule,
    AuthModule,
  ],
})
export class AppModule {}
