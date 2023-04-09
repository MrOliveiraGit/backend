import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { RmqService } from './rqm/rmq.service';


async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  await app.listen(3000);
}
bootstrap();
