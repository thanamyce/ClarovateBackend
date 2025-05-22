import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService

) {}

  async sendInvitationEmail(data: { email: string; role: string; inviteLink: string }): Promise<void> {
    try {
      await this.mailerService.sendMail({
        to: data.email,
        subject: 'You’re Invited!',
        template: 'invite',
        context: {
          email:data.email,
          role: data.role,
          inviteLink: data.inviteLink,
        },
      });
      console.log('Invitation email sent successfully.');
    } catch (error) {
      console.error('Error sending invitation email:', error);
      throw error;
    }
  }
}