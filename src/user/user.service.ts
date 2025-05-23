import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  BadRequestException,
  InternalServerErrorException,
  HttpStatus,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument, UserRole } from 'src/user/user.schema';
import { CreateUserDto, RedeemDto, UpdateUserDto } from './user.dto';
import * as bcrypt from 'bcryptjs';
import { ConfigService } from '@nestjs/config';
import { Invitation, InvitationDocument } from 'src/invitation/invitation.schema';
import { AuthService } from 'src/auth/auth.service';
import { retry } from 'rxjs';
import { CounterSchema } from './counter.schema';
import { ResponseHelper } from 'src/util/response';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(Invitation.name) private readonly InvitationModel: Model<InvitationDocument>,
    @InjectModel('CounterSchema') private readonly counterModel: Model<any>,
    private configService: ConfigService,
    private readonly authService: AuthService
  ) {}

  async createUser(user: CreateUserDto) {
    try {
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(user.password, salt);

      const newUser = new this.userModel({
        ...user,
        password: hashPassword,
      });

      const createdUser = await newUser.save();
      return {
        message: "User successfully created",
        user: {
          firstName: createdUser.firstName,
          lastName: createdUser.lastName,
        },
      };
    } catch (error) {
      throw new InternalServerErrorException('User creation failed');
    }
  }

  async login(email: string, password: string): Promise<{ user: any }> {
    const user = await this.userModel.findOne({ email }).select([
      'firstName',
      'lastName',
      'email',
      'password',
      'role',
    ]);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const userObj:any = user.toObject();
    delete userObj.password;

    return { user: userObj };
  }

  async logout(id: string): Promise<User> {
    const updatedUser = await this.userModel.findByIdAndUpdate(
      id,
      { $set: { refreshToken: null } },
      { new: true }
    );

    if (!updatedUser) throw new NotFoundException('User not found');
    return updatedUser;
  }

  async updateUser(dataToUpdate: UpdateUserDto, id: string): Promise<User> {
    const updatedUser = await this.userModel.findByIdAndUpdate(
      id,
      { $set: dataToUpdate },
      { new: true }
    );
    if (!updatedUser) throw new NotFoundException('User not found');
    return updatedUser;
  }

  async getUser(id: string): Promise<User> {
    const user = await this.userModel.findById(id);
    if (!user) throw new NotFoundException('User not found');
    const userObj:any = user.toObject();
    delete userObj.password;
    return userObj;
  }

  async deleteUser(id: string): Promise<{ message: string }> {
    const user = await this.userModel.findById(id);
    if (!user) throw new NotFoundException('User not found');

    await this.userModel.deleteOne({ _id: id });
    return { message: 'User deleted successfully' };
  }

  async createAdmin() {
    const existingAdmin = await this.userModel.findOne({ role: 'ADMIN' });

    if (existingAdmin) {
      console.log('Admin already exists');
      return;
    }

    const email = this.configService.get<string>('ADMIN_EMAIL');
    const password = this.configService.get<string>('ADMIN_PASSWORD');
    const firstName = this.configService.get<string>('ADMIN_NAME');
    const lastName = this.configService.get<string>('ADMIN_LASTNAME');

    if (!password) {
      console.log('No admin password configured');
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    const newAdmin = new this.userModel({
      _id: 'USER01',
      email,
      password: hashPassword,
      firstName,
      lastName,
      role: 'ADMIN',
      isAdmin: true,
    });

    const user = await newAdmin.save();
    if (user) {
      console.log('Admin successfully created');
    }
  }

  async checkToken(id: string, token: string): Promise<boolean> {
    const user = await this.userModel.findById(id);
    if (!user?.refreshToken || user.refreshToken !== token) {
      return false;
    }
    return true;
  }

  async getNextSequence(name: string): Promise<number> {
    const result = await this.counterModel.findOneAndUpdate(
      { id: name },
      { $inc: { seq: 1 } },
      { new: true, upsert: true },
    );
    return result.seq;
  }
  getRoles(){
      const roles:string[] = ["ADMIN","USER","DESIGNER","DATA_ENGINEER","CO-ADMIN","SUPERVISOR"]
      return roles
  }
  async allUsers() {
    const users = await this.userModel.find({});
    return users.length > 0 ? users : [];
  }

async changeActiveStatus(status:boolean,id: string){

    try {
      const user = await this.userModel.findById({id});
      if(!user){
        return ResponseHelper.success(null,"User not found",HttpStatus.NOT_FOUND)
      }else{
        const updatedUser = await this.userModel.findByIdAndUpdate({id},{
          $set:{isActive:status},
        })
        if(updatedUser){
          return ResponseHelper.success(updatedUser,"User successfully updated",HttpStatus.OK)
        }
      }
    } catch (error) {
      return ResponseHelper.error(error,"Something went wrong",HttpStatus.INTERNAL_SERVER_ERROR)
    }
  
}

  async invitaionRedeem(user: RedeemDto) {
    const invitation = await this.InvitationModel.findOne({ token: user.token });
    if (!invitation) throw new BadRequestException('Invalid invitation token');

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(user.password, salt);
    const seq = await this.getNextSequence('user');
    const newUser = new this.userModel({
      _id: `USER${seq.toString().padStart(2, '0')}`,
      email: invitation.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: invitation.role,
      password: hashPassword,
    });

    await this.InvitationModel.deleteOne({ email: invitation.email });
    const createdUser = await newUser.save();

    const userObj:any = createdUser.toObject();
    delete userObj.password;

    return userObj;
  }
}
