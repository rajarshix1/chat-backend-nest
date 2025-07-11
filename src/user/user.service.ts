import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/user/schema/user.schema';
import * as bcrypt from 'bcrypt'
import { ReturnUserDto } from './schema/user.dto';
@Injectable()
export class UserService {
    constructor(@InjectModel(User.name) private userModel: Model<User>) {}
    async getUsers(): Promise<User[]> {
        const data = await this.userModel.find()
        return data;
    }
    async getUserById(id : string): Promise<User | null> {
        console.log(id)
        const data : User | null = await this.userModel.findById(id)
        return data;
    }
    async createUser(body: User): Promise<ReturnUserDto> {
        const {name, email, phoneNumber, password} = body
        const saltOrRounds:number = 10;
        const hashedPassword: string = await bcrypt.hash(password, saltOrRounds);
        const data: ReturnUserDto = await this.userModel.insertOne({name, email, phoneNumber, password: hashedPassword})
        data.password = undefined
        return data;
    }
}
