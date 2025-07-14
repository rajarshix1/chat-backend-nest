import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/user/schema/user.schema';
import * as bcrypt from 'bcrypt'
import { LoginUserDto,  ReturnUserDto } from './schema/user.dto';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class UserService {
    constructor(
      @InjectModel(User.name) private userModel: Model<User>,
      private jwtService: JwtService
    ) {}
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
      try {
        console.log(body)
          const {name, email, phoneNumber, password} = body
        if(!name || !email || !phoneNumber ||!password) throw new BadRequestException("Required fields missing")
        const saltOrRounds:number = 10;
        const hashedPassword: string = await bcrypt.hash(password, saltOrRounds);
        const data: ReturnUserDto = await this.userModel.insertOne({name, email, phoneNumber, password: hashedPassword})
        data.password = undefined
        return data;
      } catch (error) {
        console.log(error.message)
        throw new InternalServerErrorException(error.message)
      }
    }

    async loginUser(body: LoginUserDto): Promise<{data: ReturnUserDto, jwt:string}>  {
      try {
        const { email, phoneNumber, password} = body

        if(!email && !phoneNumber ) throw new BadRequestException("Must provide email or phone ")
          let orCondition: Array<{[key:string]: string}> = []
        if(email) orCondition.push({email: email })
        if(phoneNumber) orCondition.push({ phoneNumber: phoneNumber})
          console.log(orCondition)
        const user: User | null = await this.userModel.findOne({$or: orCondition }).lean()
        // const user: User | null = await this.userModel.findOne({$or: [{email: email },{ phoneNumber: phoneNumber}] }).lean()
        if(!user) throw new NotFoundException("User not found")
        const checkPass : Boolean = await bcrypt.compare(password, user.password)
        if(!checkPass) throw new UnauthorizedException("Password didnt match")
        const returnUser: ReturnUserDto = {...user , password: undefined}
        let jwt = await this.jwtService.signAsync({email: email, phoneNumber: phoneNumber})
        return {data: returnUser, jwt}
      } catch (error) {
        console.log(error.message)
        throw new InternalServerErrorException(error.message)
      }
    }
}
