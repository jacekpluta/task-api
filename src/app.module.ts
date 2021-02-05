import { Module } from '@nestjs/common';
import { TasksModule } from './tasks/tasks.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configServiceTypeOrm } from './config/all.config';
import { EasyconfigModule } from 'nestjs-easyconfig';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    EasyconfigModule.register({ path: './.env' }),
    TypeOrmModule.forRoot(configServiceTypeOrm.getTypeOrmConfig()),
    TasksModule,
    AuthModule,
  ],
})
export class AppModule {}
