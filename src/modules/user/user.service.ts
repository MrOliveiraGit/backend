import { InjectModel } from '@nestjs/mongoose';
import { BadRequestException, Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema'
import { unlink,readFile } from 'node:fs/promises';
import { MailerService } from '@nestjs-modules/mailer';
import axios from 'axios';
import { ClientProxy } from '@nestjs/microservices';
import multer from 'multer';




@Injectable()
export class UserService {
  

  constructor(@Inject('USER_SERVICE') private client: ClientProxy,private readonly mailerService: MailerService,@InjectModel(User.name) private readonly userModel: Model<User>){}


  async pushRMQ(pattern,data){
    return this.client.emit(pattern, data)
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    try{
      const { id, email } = createUserDto;
      const userExists = await this.userModel.findOne({ id });
      
      if (userExists) throw new BadRequestException('User already exists');
      
      const user = await this.userModel.create(createUserDto);
      
      if (!user) throw new BadRequestException('User cannot be created');
      
      if (email) this.sendEmail(email);
      
      this.pushRMQ('CREATED', { user });
      
      return user;

    }catch(error){
      this.pushRMQ('ERROR',JSON.stringify(error))
      throw new InternalServerErrorException('error on create user')
    }
  }
  
  async retriveByApi(id: number): Promise<User> {
    try{
      const response = await axios.get<User>(`https://reqres.in/api/users/${id}`)
      return response.data

    }catch(error){
      this.pushRMQ('ERROR',error)
      throw new Error('Error on retrive by api')
    }
  }

  async retriveAvatar(id:number){
    const { avatar } = await this.retriveByApi(id)
    return avatar
  }

  async sendEmail(email){
    try{
      const result = await this.mailerService
        .sendMail({
          to: email, // list of receivers
          from: 'noreply@nestjs.com', // sender address
          subject: 'User Created', // Subject line
          text: 'welcome', // plaintext body
          html: '<b>welcome you user has cretaed</b>', // HTML body content
        })
    }catch(error){
      this.pushRMQ('ERROR',error)
      throw new Error('error on send emil')
    }
     
  }

  async retriveByDb(id: number): Promise<User> {
    return await this.userModel.findOne({ id: id })
  }


  async removeAvatar(id:number): Promise<User>{
    const { AVATARS_PATH } = process.env
    try{
      const user = await this.userModel.findOne({ id })
      await unlink(`${AVATARS_PATH}/${user.avatar}`)
      return await this.userModel.findOneAndUpdate({ id }, { avatar: '' },{ new: true})
    }catch(error){
      throw new Error('error on delete avatar and image')
    }
  }
}
