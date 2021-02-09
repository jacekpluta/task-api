import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/user.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';
import { TaskRepository } from './task.repository';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository)
    private taskRepository: TaskRepository,
  ) {}

  async getTaskById(id: number, user: User): Promise<Task> {
    const taskFound = await this.taskRepository.findOne({
      where: { userId: user.id, id },
    });

    if (!taskFound) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
    return taskFound;
  }

  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    return this.taskRepository.createTask(createTaskDto, user);
  }

  async getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
    const tasks = await this.taskRepository.getTasks(filterDto, user);

    return tasks;
  }

  async changeTaskStatus(id: number, status: TaskStatus, user): Promise<Task> {
    const task = await this.getTaskById(id, user);
    task.status = status;

    await task.save();
    return task;
  }

  async deleteTaskById(id: number, user: User): Promise<string> {
    const result = await this.taskRepository.delete({
      userId: user.id,
      id: id,
    });

    if (result.affected === 0) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }

    return `Task with ID "${id}" deleted`;
  }
}
