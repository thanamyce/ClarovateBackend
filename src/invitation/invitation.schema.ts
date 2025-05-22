import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { UserRole } from "src/user/user.schema";

export type  InvitationDocument = Invitation & Document;
@Schema({timestamps: true})
export class Invitation{
    @Prop({ required: true, unique: true })
  email: string;

  @Prop({ enum: ['USER', 'CO_ADMIN', 'ADMIN', 'SUPERVISOR', 'DESIGNER'] })
  role:UserRole; 

  @Prop({ required: true })
  token: string;

  @Prop({ required: true, default: Date.now })
  createdAt: Date;

  @Prop({required: true})
  expiresAt: Date;

  @Prop({ enum: ['PENDING', 'EXPIRED'], default: 'PENDING' })
  status: string; 

  @Prop({required: true})
  createdBy: string;
}

export const  InvitaionSchema = SchemaFactory.createForClass(Invitation);

