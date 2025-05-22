import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/user.schema';

@Injectable()
export class AuthService {
constructor(private readonly jwtService: JwtService){}

async generateToken(user:User): Promise<string>{
    const payload = {
        id:user._id,
        email:user.email,
        role:user.role
    }
     const access_token = await this.jwtService.signAsync(payload);
     return access_token
}
}
