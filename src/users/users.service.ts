import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Role } from '../auth/role.entity';
import { UserDto } from './user.dto';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { userRepository } from './users.repository';


@Injectable()
export class UsersService {
  constructor(@InjectRepository(User)
  private userRepository:  userRepository,
  ) { }

  async findOne(username: string): Promise<User | undefined> {
    const user = await this.userRepository.findOne({ where: { username }, relations: { roles: true } });
    return user;
  }

  async getProfile(username: string): Promise<UserDto | undefined> {
    const user = await this.userRepository.findOne({ where: { username } });
    if (!user) {
      return undefined;
    }
    const userDto = new UserDto();
    // userDto.email = user.email;
    userDto.username = user.username;
    return userDto;
  }

  async create(username: string, email:string,password: string): Promise<User | undefined> {
    //检查用户唯一

    const user = new User();
    user.username = username;
    user.password = password;
    user.email = email;
    const role = new Role();
    role.id = 2;
    user.roles = [role];
    console.log(user)
    await this.userRepository.save(user);
    return user;
  }
}