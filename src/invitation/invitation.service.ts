import {
  Injectable,
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
  HttpStatus,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/user/user.schema';
import { Invitation, InvitationDocument } from './invitation.schema';
import { v4 as uuidv4 } from 'uuid';
import { MailService } from 'src/mail/mail.service';
import { ResponseHelper } from 'src/util/response';
import { error } from 'console';

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
      expiresAt.setDate(expiresAt.getDate() + 2);

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
        success: true,
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

  async reSendInvitation(email: string, createdBy: string) {
  try {
    const existingUser = await this.UserModel.findOne({ email });
    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    const existingInvitation = await this.InvitationModel.findOne({ email });

    const now = new Date();

    // If invitation exists and hasn't expired, block resending
    if (existingInvitation && existingInvitation.expiresAt > now) {
      throw new ConflictException('An active invitation already exists.');
    }

    // If no invitation exists at all, return a meaningful response
    if (!existingInvitation) {
      return {
        success: false,
        message: 'No previous invitation found to resend.',
      };
    }

    const token = uuidv4();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 1);

    // Update invitation
    const updatedInvitation = await this.InvitationModel.findOneAndUpdate(
      { email },
      {
        $set: {
          token,
          status: 'PENDING',
          expiresAt,
          // optionally keep the original createdBy
        },
      },
      { new: true }
    );

    if (!updatedInvitation) {
      return {
        success: false,
        message: 'Failed to update invitation.',
      };
    }

    const inviteLink = `http://portal.clarovate.io/invitation/accept/${token}`;
    await this.mailService.sendInvitationEmail({
      email,
      role: existingInvitation.role,
      inviteLink,
    });

    return {
      success: true,
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


async getInvitation() {
  try {
    const now = new Date();

    // Update invitations that should be expired but still marked as PENDING
    await this.InvitationModel.updateMany(
      { status: 'PENDING', expiresAt: { $lt: now } },
      { status: 'EXPIRED' }
    );

    // Fetch updated invitations
    const invitations = await this.InvitationModel.find();

    if (invitations.length === 0) {
      return ResponseHelper.success(invitations, "No Invitations", HttpStatus.NOT_FOUND);
    } else {
      return ResponseHelper.success(invitations, "Invitations successfully fetched", HttpStatus.OK);
    }
  } catch (error) {
    console.log(error);
    // Consider returning an error response here
    return ResponseHelper.error(error,"Failed to fetch invitations", HttpStatus.INTERNAL_SERVER_ERROR);
  }
}


  async deleteInvitation(email: string) {
  try {
    const deleted = await this.InvitationModel.findOneAndDelete({ email });

    if (deleted) {
      return ResponseHelper.success(deleted, "Deleted successfully", HttpStatus.OK);
    } else {
      return ResponseHelper.error(null, "Invitation not found", HttpStatus.NOT_FOUND);
    }
  } catch (error) {
    console.error("Error deleting invitation:", error);
    return ResponseHelper.error(error, "Internal server error", HttpStatus.INTERNAL_SERVER_ERROR);
  }
}


}
