import { Test } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User } from './schemas/user.schema';
import { ClientProxy } from '@nestjs/microservices';
import { MailerService } from '@nestjs-modules/mailer';
import { UserService } from './user.service';
import { BadRequestException,NotFoundException } from '@nestjs/common';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';



describe('UserService', () => {
  let clientProxy: ClientProxy
  let mailerService: MailerService
  let userModel: Model<User>
  let service: UserService
  const user  = {
    id: 1,
    firstName: 'teste',
    lastName: 'Este',
    email: 'teste@teste',
    avatar: 'teste.com'
  }

  beforeEach(async () => {
    const mongoTokenUser = getModelToken(User.name)
    const moduleRef = await Test.createTestingModule({
      providers:[
        { 
          provide: "USER_SERVICE",
          useValue: {
            emit: jest.fn()
          } 
        },
        {
          provide: MailerService,
          useValue: { 
            sendMail: jest.fn()
          }
        },
        {
          provide: mongoTokenUser,
          useValue: {
            create: jest.fn(),
            findOne: jest.fn(),
            findOneAndUpdate: jest.fn()
          }
        },
        UserService
        
      ],
    })
    .compile();
    
    clientProxy =  moduleRef.get('USER_SERVICE');
    mailerService = moduleRef.get(MailerService)
    userModel = moduleRef.get(mongoTokenUser)
    service = moduleRef.get(UserService)


  });

  // Add more test cases for other methods in the UserService class

  it('should send error a user: user already created', async ()=>{

    jest.spyOn(userModel,'findOne').mockResolvedValue({ user })

    await expect( service.create(user) ).rejects.toThrow(new BadRequestException('User already exists'))

  })

  it('should create user',async ()=>{
    jest.spyOn(userModel,'findOne').mockResolvedValue(null)
    jest.spyOn(userModel, 'create').mockResolvedValue(user as any)
    jest.spyOn(mailerService, 'sendMail').mockResolvedValue({ })
    jest.spyOn(clientProxy,'emit').mockResolvedValue({} as never)
    await expect( service.create(user) ).resolves.toBe(user)
  })

  it('should retrive user by api', async ()=> {

    const response = {
      user: { 
        id: 3,
        email: 'emma.wong@reqres.in',
        first_name: 'Emma',
        last_name: 'Wong',
        avatar: 'https://reqres.in/img/faces/3-image.jp'
      }
    }

    const mockAxios = new MockAdapter(axios);
    mockAxios.onGet('https://reqres.in/api/users/'+ user.id).reply(200,{ data: response.user })
    await expect(service.retriveByApi(user.id)).resolves.toStrictEqual(response.user)
  })

  it('should not find a user to hash ',async ( )=>{
    jest.spyOn(userModel,'findOne').mockResolvedValue(null)
    await expect( service.getAvatar(user.id) ).rejects.toThrow(new NotFoundException('user not found'))
  })

  it('should get error on remove avatar', async ()=>{

    jest.spyOn(userModel,'findOne').mockResolvedValue(null)
    await expect(service.removeAvatar(user.id)).rejects.toThrow(new NotFoundException('user not found'))

  })



});

