import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ClientService } from './client.service';
import { ClientController } from './client.controller';
import { Client, ClientSchema } from './client.schema';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [MongooseModule.forFeature([
    { name: Client.name, schema: ClientSchema }
  ]),
UserModule],
  controllers: [ClientController],
  providers: [ClientService],
})
export class ClientModule {}