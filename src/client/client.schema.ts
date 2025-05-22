import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

// Define Schema for Alternate Contact
class AlternateContact {
  @Prop()
  name: string;

  @Prop()
  contactNo: string;

  @Prop()
  jobTitle: string; // New field for job title
}

@Schema({ timestamps: true })
export class Client extends Document {

  @Prop()
  declare _id: string; // Custom clientId as primary key

  @Prop()
  clientName: string;

  @Prop()
  hqCountry: string;

  @Prop()
  clientCode: string;

  @Prop()
  clientContactNo: string;

  @Prop()
  clientMail: string;

  @Prop()
  chatId: string;

  @Prop({ type: [{ name: String, contactNo: String, jobTitle: String }], default: [] })
  alternateContacts: AlternateContact[];
  
  @Prop()
  createdBy: string;
  
  @Prop()
  updatedBy: string;
}

export const ClientSchema = SchemaFactory.createForClass(Client);