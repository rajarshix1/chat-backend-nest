import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/user/schema/user.schema';

@Injectable()
export class UserService {
    constructor(@InjectModel(User.name) private userModel: Model<User>) {}
    async getUsers(): Promise<User[]> {
        const data = await this.userModel.find()
        return data;
    }
    async createUser(body: User): Promise<User> {
        const {name, email, phoneNumber, password} = body
        const data: User = await this.userModel.insertOne({name, email, phoneNumber, password})
        return data;
    }
}
