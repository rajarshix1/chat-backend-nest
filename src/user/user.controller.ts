import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './schema/user.schema';
import { ReturnUserDto } from './schema/user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
    @Get()
    getUser() : Promise<User[]> {
        return this.userService.getUsers()
    }
    @Get('/sss')
    getUserSSS() : Promise<User[]> {
        return this.userService.getUsers()
    }
    @Get(":id")
    getUserById(@Param("id") id: string) : Promise<User | null> {
        return this.userService.getUserById(id)
    }
    @Post()
    createUser(@Body() body: User) : Promise<ReturnUserDto> {
        return this.userService.createUser(body)
    }

    
}
