import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, forgetPasswordDto, RedeemDto, resetPasswordDto, StatusUpdateDto } from './user.dto';
import { UpdateUserDto, LoginDto } from './user.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { ReqUser } from 'src/util/decorates';
import { AuthService } from 'src/auth/auth.service';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './user.schema';
import { get, Model } from 'mongoose';
import { AuthAdmin } from 'src/auth/auth.admin';
import { ResponseHelper } from 'src/util/response';

import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';

@Controller('')
@ApiTags('User') // Grouping in Swagger UI
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  @Post('login')
  @ApiOperation({ summary: 'User login' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, description: 'User successfully logged in' })
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async login(@Body() body: LoginDto) {
    const { user } = await this.userService.login(body.email, body.password);
    const access_token = await this.authService.generateToken(user);

    await this.userModel.findByIdAndUpdate(
      user._id,
      { $set: { refreshToken: access_token } },
      { new: true }
    );
    console.log(access_token)
    return ResponseHelper.success(
      { user, access_token },
      'User successfully logged in',
      HttpStatus.OK
    );
  }

  @UseGuards(AuthGuard)
  @Get('user/:id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'User fetched successfully' })
  @ApiBearerAuth()
  async getUser(@Param('id') id: string) {
    const user = await this.userService.getUser(id);
    return ResponseHelper.success(user, 'User fetched successfully', HttpStatus.OK);
  }

  @UseGuards(AuthGuard)
  @Put('user/:id')
  @ApiOperation({ summary: 'Update user by ID' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({ status: 200, description: 'User updated successfully' })
  @ApiBearerAuth()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async updateUser(@Body() update: UpdateUserDto, @Param('id') id: string) {
    const updatedUser = await this.userService.updateUser(update, id);
    return ResponseHelper.success(updatedUser, 'User updated successfully', HttpStatus.OK);
  }

  @UseGuards(AuthGuard)
  @Delete('user/:id')
  @ApiOperation({ summary: 'Delete user by ID' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  @ApiBearerAuth()
  async deleteUser(@Param('id') id: string) {
    const result = await this.userService.deleteUser(id);
    return ResponseHelper.success(result, result.message, HttpStatus.OK);
  }

  @Post('InvitationRedeem')
  @ApiOperation({ summary: 'Redeem user invitation' })
  @ApiBody({ type: RedeemDto })
  @ApiResponse({ status: 201, description: 'User created from invitation' })
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async invitationRedeem(@Body() user: RedeemDto) {
    const newUser = await this.userService.invitaionRedeem(user);
    return ResponseHelper.success(newUser, 'User successfully created from invitation', HttpStatus.CREATED);
  }

  @UseGuards(AuthGuard)
  @Post('logout')
  @ApiOperation({ summary: 'User logout' })
  @ApiResponse({ status: 200, description: 'Logout successful' })
  @ApiBearerAuth()
  async logout(@ReqUser() reqUser: any) {
    await this.userService.logout(reqUser.id);
    return ResponseHelper.success(null, 'Logout successful', HttpStatus.OK);
  }

  @UseGuards(AuthAdmin)
  @Get('users')
  @ApiOperation({ summary: 'Get all users (admin only)' })
  @ApiResponse({ status: 200, description: 'All users fetched' })
  @ApiBearerAuth()
  async getAll() {
    const users = await this.userService.allUsers();
    console.log("success: ",users)
    return ResponseHelper.success(users, 'Users fetched successfully', HttpStatus.OK);
  }

  @UseGuards(AuthAdmin)
  @Patch('user/updatestatus/:id')
  @ApiOperation({ summary: 'Update user status (admin only)' })
  @ApiResponse({ status: 200, description: 'status successfully updated' })
  @ApiBearerAuth()
  async updateStatus(@Body() body:StatusUpdateDto,@Param('id') id:string){
    return this.userService.changeActiveStatus(body.status,id);

  }

  @Post('forgetpassword')
  @ApiOperation({ summary: 'send forget password email' })
  @ApiResponse({ status: 200, description: 'forget password successfully sent' })
  async forgetPassword(@Body() body:forgetPasswordDto){
    return this.userService.forgetPassword(body.email);

  }

  @Patch('resetpassword')
  @ApiOperation({ summary: 'reset current password' })
  @ApiResponse({ status: 200, description: 'password successfully reset' })
  async resetPassword(@Body() body:resetPasswordDto){
    return this.userService.resetPassword(body.email,body.token,body.password);
  }



  @Get('roles')
  @ApiOperation({ summary: 'Get Roles' })
  @ApiResponse({ status: 200, description: 'Roles fetched' })
 getRoles(){
    const roles = this.userService.getRoles()
    return ResponseHelper.success(roles, 'Roles successfully fetched', HttpStatus.OK);
  }

}
