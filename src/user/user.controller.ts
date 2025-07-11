import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './schema/user.schema';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
    @Get()
    getUser() : Promise<User[]> {
        return this.userService.getUsers()
    }
    @Post()
    createUser(@Body() body: User) : Promise<User> {
        return this.userService.createUser(body)
    }

    
}
