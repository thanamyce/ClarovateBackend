import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { OrganizationService } from './organization/organization.service';
import { UserService } from './user/user.service';
import { User, UserDocument } from './user/user.schema';

@Injectable()
export class AppService implements OnModuleInit{
  constructor(@InjectConnection() private readonly connection:Connection,
  private readonly organizationService: OrganizationService,
  private readonly userService: UserService,
  @InjectModel(User.name) private userModel: Model<UserDocument>

){}
  getHello(){}
  async onModuleInit() {
    this.connection.on('done', () => {
      console.log('✅ MongoDB is connected successfully');
    });

    this.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
    });

    this.connection.on('disconnected', () => {
      console.warn('⚠️ MongoDB disconnected');
    });

   try {
   
     const organization:any = await this.organizationService.createInternalOrganization();
      const user:any = await this.userService.createAdmin(organization._id);
   } catch (error) {
    console.log(error)
    
   }


  }
}
