import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';

describe('UserController', () => {
  let controller: UserController;

  const mockUserService = {
    create: jest.fn(dto => {
      return{...dto}
    })
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UserService],
    })
    .overrideProvider(UserService)
    .useValue(mockUserService)
    .compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a user',() => {
    expect(controller.create({nameFirst: 'Teste', lastName: 'TESTE2',email:'oliveira@gmail',id: 1,avatar:'eu.png'})).toEqual({
      id: expect.any(Number),
      nameFirst:'Teste',
      lastName:'TESTE2',
      email:'oliveira@gmail',
      avatar:'eu.png'
    })
  })

});
