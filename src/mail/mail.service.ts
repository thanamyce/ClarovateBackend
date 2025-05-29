import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService

) {}

  async sendInvitationEmail(data: { email: string; role: string; inviteLink: string , organizationName?: string}): Promise<void> {
    try {
      await this.mailerService.sendMail({
        to: data.email,
        subject: 'You’re Invited!',
        template: 'invite',
        context: {
          email:data.email,
          role: data.role,
          inviteLink: data.inviteLink,
          OrganizationName: data.organizationName || 'Clarovate'
        },
      });
      console.log('Invitation email sent successfully.');
    } catch (error) {
      console.error('Error sending invitation email:', error);
      throw error;
    }
  }

  async sendforgetPasswordEmail(data: { email: string; forgetPasswordLink: string }): Promise<void> {
    try {
      await this.mailerService.sendMail({
        to: data.email,
        subject: 'Forget password!',
        template: 'forgetPassword',
        context: {
          email:data.email,
          forgetPasswordLink: data.forgetPasswordLink,
        },
      });
      console.log('Invitation email sent successfully.');
    } catch (error) {
      console.error('Error sending invitation email:', error);
      throw error;
    }
  }
}