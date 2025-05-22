import { Body, Controller, Post, UseGuards, HttpStatus, UsePipes, ValidationPipe } from '@nestjs/common';
import { InvitationService } from './invitation.service';
import { ReqUser } from 'src/util/decorates';
import { AuthAdmin } from 'src/auth/auth.admin';
import { ResponseHelper } from 'src/util/response';
import { InvitationDto } from './invitation.dto';

import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth
} from '@nestjs/swagger';

@Controller('')
@ApiTags('Invitations') // Group routes in Swagger UI
export class InvitationController {
  constructor(private readonly invitationService: InvitationService) {}

  @Post('sendinvitation')
  @UseGuards(AuthAdmin)
  @ApiOperation({ summary: 'Send a new invitation' })
  @ApiBody({ type: InvitationDto })
  @ApiResponse({ status: 200, description: 'Invitation sent successfully' })
  @ApiBearerAuth()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async sendInvitation(@Body() newUser: InvitationDto, @ReqUser() reqUser: any) {
    const createdBy = reqUser.id;
    const result = await this.invitationService.sendInvitation(newUser.email, newUser.role, createdBy);
    console.log("invitation sent")
    return ResponseHelper.success(result, result.message, HttpStatus.OK);
  }

  @Post('resendinvitation')
  @UseGuards(AuthAdmin)
  @ApiOperation({ summary: 'Resend an invitation' })
  @ApiBody({ type: InvitationDto })
  @ApiResponse({ status: 200, description: 'Invitation re-sent successfully' })
  @ApiBearerAuth()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async reSendInvitation(@Body() newUser: InvitationDto, @ReqUser() reqUser: any) {
    const createdBy = reqUser.id;
    const result = await this.invitationService.reSendInvitation(newUser.email, newUser.role, createdBy);
    return ResponseHelper.success(result, result.message, HttpStatus.OK);
  }
}
