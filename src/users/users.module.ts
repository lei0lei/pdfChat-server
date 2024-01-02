import { Module } from '@nestjs/common';
// import { DatabaseModule } from 'src/database.module';
// import { userProviders } from './users.providers';
import { UsersService } from './users.service';
import { userRepository } from './users.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UsersService, ],
  exports: [UsersService],
})
export class UsersModule { }




// import { Module } from '@nestjs/common';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { UsersService } from './users.service';
// import { User } from './user.entity';

// @Module({
//   imports: [TypeOrmModule.forFeature([User])],
//   providers: [UsersService],
//   exports: [UsersService]
// })
// export class UsersModule {}