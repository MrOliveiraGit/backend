import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User,UserSchema } from './schemas/user.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { ClientsModule,Transport } from '@nestjs/microservices';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    ClientsModule.register([{
      name: 'USER_SERVICE',
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://test:test@172.17.0.1:5672'],
        queue: 'user_queue',
        queueOptions: {
          durable: false
        }
      }
    }])
  ],
  controllers: [UserController],
  providers: [UserService]
})
export class UserModule {
  
}
