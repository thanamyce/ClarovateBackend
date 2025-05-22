import {
  Injectable,
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/user/user.schema';
import { Invitation, InvitationDocument } from './invitation.schema';
import { v4 as uuidv4 } from 'uuid';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class InvitationService {
  constructor(
    @InjectModel(User.name) private readonly UserModel: Model<UserDocument>,
    @InjectModel(Invitation.name) private readonly InvitationModel: Model<InvitationDocument>,
    private readonly mailService: MailService,
  ) {}

  async sendInvitation(email: string, role: string, createdBy: string) {
    try {
      const existingUser = await this.UserModel.findOne({ email });
      if (existingUser) {
        throw new ConflictException('User already exists');
      }

      const existingInvitation = await this.InvitationModel.findOne({ email });
      if (existingInvitation) {
        throw new ConflictException('Invitation already sent and is still pending');
      }

      const token = uuidv4();
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 1);

      const newInvitation = new this.InvitationModel({
        email,
        role,
        token,
        status: 'PENDING',
        expiresAt,
        createdBy,
      });

      await newInvitation.save();

      const inviteLink = `http://portal.clarovate.io/invitation/accept/${token}`;
      await this.mailService.sendInvitationEmail({ email, role, inviteLink });

      return {
        message: 'Invitation sent successfully',
      };
    } catch (error) {
      if (error instanceof ConflictException || error instanceof BadRequestException) {
        throw error;
      }
      console.error('Send Invitation Error:', error);
      throw new InternalServerErrorException('Failed to send invitation');
    }
  }

  async reSendInvitation(email: string, role: string, createdBy: string) {
    try {
      const existingUser = await this.UserModel.findOne({ email });
      if (existingUser) {
        throw new ConflictException('User already exists');
      }

      const existingInvitation = await this.InvitationModel.findOne({ email });
      const now = new Date();

      if (existingInvitation && now < existingInvitation.expiresAt) {
        throw new ConflictException('Invitation already sent and is still pending');
      }

      const token = uuidv4();
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 1);

      const newInvitation = new this.InvitationModel({
        email,
        role,
        token,
        status: 'PENDING',
        expiresAt,
        createdBy,
      });

      await newInvitation.save();

      const inviteLink = `http://portal.clarovate.io/invitation/accept/${token}`;
      await this.mailService.sendInvitationEmail({ email, role, inviteLink });

      return {
        message: 'Invitation resent successfully',
      };
    } catch (error) {
      if (error instanceof ConflictException || error instanceof BadRequestException) {
        throw error;
      }
      console.error('Resend Invitation Error:', error);
      throw new InternalServerErrorException('Failed to resend invitation');
    }
  }
}
