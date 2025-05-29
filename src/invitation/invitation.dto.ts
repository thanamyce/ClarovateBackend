import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class InvitationDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'admin', description: 'Role assigned to invited user' })
  @IsString()
  @IsNotEmpty()
  role: string;
  
    @ApiProperty({ example: 'CLIENT', enum: ['INTERNAL', 'CLIENT'], description: 'Type of user (INTERNAL or CLIENT)' })
  @IsEnum(['INTERNAL', 'CLIENT'])
  @IsNotEmpty()
  type: string;
 
  @ApiProperty({ example: '507f1f77bcf86cd799439011', description: 'Organization ID (MongoDB ObjectId)', required: false })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => {
    if (value && typeof value === 'object' && value.toString) {
      return value.toString();
    }
    return value;
  })
  organizationId?: string;

}

export class ReInvitationDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
