import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Injectable()
export class AppService implements OnModuleInit{
  constructor(@InjectConnection() private readonly connection:Connection){}
  getHello(){}
  onModuleInit() {
    this.connection.on('done', () => {
      console.log('✅ MongoDB is connected successfully');
    });

    this.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
    });

    this.connection.on('disconnected', () => {
      console.warn('⚠️ MongoDB disconnected');
    });
  }
}
