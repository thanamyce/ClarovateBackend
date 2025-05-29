import { Body, Controller, Post, UseGuards, HttpStatus, UsePipes, ValidationPipe, Get } from '@nestjs/common';
import { InvitationService } from './invitation.service';
import { ReqUser } from 'src/util/decorates';
import { AuthAdmin } from 'src/auth/auth.admin';
import { ResponseHelper } from 'src/util/response';
import { InvitationDto, ReInvitationDto } from './invitation.dto';

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
    let organizationId = '';
    if(newUser.organizationId){
      organizationId = newUser.organizationId
    }
    const result = await this.invitationService.sendInvitation(newUser.email, newUser.role,newUser.type, organizationId, createdBy);
    console.log("invitation sent")
    return ResponseHelper.success(result, result.message, HttpStatus.OK);
  }

  @Post('resendinvitation')
  @UseGuards(AuthAdmin)
  @ApiOperation({ summary: 'Resend an invitation' })
  @ApiBody({ type: ReInvitationDto })
  @ApiResponse({ status: 200, description: 'Invitation re-sent successfully' })
  @ApiBearerAuth()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async reSendInvitation(@Body() newUser: ReInvitationDto, @ReqUser() reqUser: any) {
    const createdBy = reqUser.id;
    const result = await this.invitationService.reSendInvitation(newUser.email, createdBy);
    return ResponseHelper.success(result, result.message, HttpStatus.OK);
  }

  @Get('invitations')
  @UseGuards(AuthAdmin)
  @ApiOperation({ summary: 'Get invitation detail' })
  @ApiResponse({ status: 200, description: 'Invitation fetched successfully' })
  @ApiBearerAuth()
  async getInvitations(){
    return this.invitationService.getInvitation();
  }

  @Post('deleteinvitation')
  @UseGuards(AuthAdmin)
  @ApiOperation({ summary: 'delete invitation' })
  @ApiResponse({ status: 200, description: 'Invitation deleted successfully' })
  @ApiBearerAuth()
  async deleteInvitations(@Body() body:{email:string}){
    return this.invitationService.deleteInvitation(body.email);
  }

}
