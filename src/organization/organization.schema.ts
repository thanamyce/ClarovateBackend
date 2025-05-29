import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum OrganizationType {
  INTERNAL = 'INTERNAL',
  CLIENT = 'CLIENT'
}

@Schema({ timestamps: true })
export class Organization {

  @Prop({required: true})
  organizationName: string;

  @Prop()
  hqCountry: string;

  @Prop()
  contactNo: string;

  @Prop({unique: true})
  email: string;

  @Prop({ enum: OrganizationType , required: true})
  type: OrganizationType;

  @Prop()
  createdBy: string;
  
  @Prop()
  updatedBy: string;
}

export type OrganizationDocument = Organization & Document;
export const OrganizationSchema = SchemaFactory.createForClass(Organization); 