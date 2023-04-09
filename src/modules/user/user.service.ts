import { InjectModel } from '@nestjs/mongoose';
import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema'
import { unlink } from 'node:fs/promises';
import { MailerService } from '@nestjs-modules/mailer';
import axios from 'axios';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class UserService {
  

  constructor(@Inject('USER_SERVICE') private client: ClientProxy,private readonly mailerService: MailerService,@InjectModel(User.name) private readonly userModel: Model<User>){}


  async pushRMQ(data){
    return this.client.emit('LOG', data)
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    try{
      const userExists = await this.userModel.findOne({ id: createUserDto.id })
      
      if(userExists){
        throw new Error('user already exists')
      }
      const user = await this.userModel.create(createUserDto)
      if(user == null){
        throw new Error('not avaliable for create User')
      }
      if(user.email != null){
        this.sendEmail(user.email)
      }
      this.pushRMQ({ user })
      return user

    }catch(error){
      console.log(error)
      throw new Error('error on create email')

    }
  }
  

  async updateAvatar(id,file: Express.Multer.File) {
    try{
      return await this.userModel.findOneAndUpdate({ id }, { avatar: `${file.filename}`},{ new: true})
    }catch(error){
      throw new Error('error on save avatar')
    }
  }

  async sendEmail(email){
    console.log('----------------')
    console.log(email)
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
      console.log(error)
      throw new Error('error on send emil')
    }
     
  }

  async justSendTestEmail(email: string){
    try{
      const result = await this.sendEmail(email)
      console.log(result)
    }catch(error){
      console.log(error)
      throw new Error('Error email Test')
    }
  }

  findAll() {
    return `This action returns all user`;
  }

  async retriveByDb(id: number): Promise<User> {
    return await this.userModel.findById({ id })
  }

  async retriveByApi(id: number) {
    try{
      const response = await axios.get(`/api/users/${id}`)
      console.log(response)
      return response

    }catch(error){
      console.log(error)
    }
  }


  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
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
