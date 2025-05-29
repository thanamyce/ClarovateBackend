import { forwardRef, Module } from '@nestjs/common';
import { InvitationService } from './invitation.service';
import { InvitationController } from './invitation.controller';
import { Invitation, InvitaionSchema } from './invitation.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from 'src/user/user.module';
import { MailModule } from 'src/mail/mail.module';
import { Organization, OrganizationSchema } from 'src/organization/organization.schema';


@Module({
  imports: [
    MongooseModule.forFeature([{ name: Invitation.name, schema: InvitaionSchema },{name: Organization.name, schema: OrganizationSchema}]),
    MailModule, 
    forwardRef(() => UserModule)
  ],
  providers: [InvitationService],
  controllers: [InvitationController],
  exports: [MongooseModule, InvitationService]
})
export class InvitationModule {}
