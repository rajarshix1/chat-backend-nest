import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './schema/user.schema';
import { LoginUserDto, ReturnUserDto } from './schema/user.dto';

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
    async register(@Body() body: User) : Promise<ReturnUserDto> {
        return await this.userService.createUser(body)
    }
    @Post('login')
    async login(@Req() req:any, @Body() body: LoginUserDto) : Promise<{data: ReturnUserDto, jwt:string}> {
        const {data, jwt} = await this.userService.loginUser(body)
        req.user = data
        return {data, jwt}
    }

    
}
