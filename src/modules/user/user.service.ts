import { InjectModel } from '@nestjs/mongoose';
import { BadRequestException, Inject, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema'
import { unlink,readFile } from 'node:fs/promises';
import { MailerService } from '@nestjs-modules/mailer';
import axios from 'axios';
import { ClientProxy } from '@nestjs/microservices';
import * as fs from 'fs';
import * as crypto from 'crypto'
import { error } from 'node:console';




@Injectable()
export class UserService {
  
  baseUrl = 'https://reqres.in/api/users/'


  constructor(@Inject('USER_SERVICE') private client: ClientProxy,private readonly mailerService: MailerService,@InjectModel(User.name) private readonly userModel: Model<User>){}


  async pushRMQ(pattern,data){
    return this.client.emit(pattern, data)
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
   
    const { id, email } = createUserDto;
    const userExists = await this.userModel.findOne({ id });
    
    if (userExists) throw new BadRequestException('User already exists');
    
    const user = await this.userModel.create(createUserDto);
    
    if (!user) throw new BadRequestException('User cannot be created');
    
    if (email) this.sendEmail(email);
    
    this.pushRMQ('CREATED', { user });
    
    return user;

  }
  
  async retriveByApi(id: number) {
    try{
      const response = (await axios.get(`${this.baseUrl}${id}`)).data
      return response.data
    }catch(error){
      this.pushRMQ('ERROR',error)
      throw new Error('Error on retrive by api')
    }
  }

  async getAvatar(userId: number) {
    const path = 'avatars/'
    const user = await this.userModel.findOne({ id: userId })
    if( !user || !user.firstName  ) throw new NotFoundException('user not found')
    try {
      const hash = this.hash64(user)
      const haveIamge = await this.directoryListAvatars(hash)
      if(haveIamge){
        return `${path}${hash}.jpg`
      }else{
        const response = await axios({
          method: 'get',
          url: user.avatar,
          responseType: 'arraybuffer'
        });
        const buffer = Buffer.from(response.data, 'binary');
        await fs.promises.writeFile(`${path}${hash}.jpg`, buffer);
        return `${path}${hash}.jpg`
      }
    } catch (error) {
      throw new InternalServerErrorException(" Error on hash file")
    }
  }

  hash64 ({ id,firstName }: User){
    return crypto.createHash('sha256').update(id + firstName).digest('base64').replace('/', '_')
  }
  async directoryListAvatars(hashedImage){

    const path = 'avatars/'
    try {
      const files = await fs.promises.readdir(path);
      const exists = files.some(file => {
        const fileName = file.split('.')[0]
        return fileName === hashedImage
      });
  
      return exists
    } catch (error) {
      throw new InternalServerErrorException('Error on hash')
    }
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
      throw new Error('error on send emial')
    }
     
  }

  async retriveByDb(id: number): Promise<User> {
    return await this.userModel.findOne({ id: id })
  }


  async removeAvatar(id:number): Promise<User>{
    const user = await this.userModel.findOne({ id })
    if(!user) throw new NotFoundException('user not found')
    const hash = this.hash64(user)
    await unlink(`avatars/${hash}.jpg`)
    return await this.userModel.findOneAndUpdate({ id }, { avatar: '' },{ new: true})
  }

  async updateUser(id:number,updateDto){
    const user = await this.userModel.findOne({ id })
    if(!user) throw new NotFoundException('user not found')
    return await this.userModel.findOneAndUpdate({ id } , { ...updateDto },{ new: true})
  }



}
