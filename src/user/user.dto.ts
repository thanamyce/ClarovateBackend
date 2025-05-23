import { IsBoolean, IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

// For user registration
export class CreateUserDto {
  @ApiProperty({ example: '60f1b7c5b4dcb12a34567890', description: 'User ID (usually auto-generated)' })
  @IsNotEmpty()
  readonly _id: string;

  @ApiProperty({ example: 'user@clarovate.io' })
  @IsEmail()
  readonly email: string;

  @ApiProperty({ example: 'John' })
  @IsNotEmpty()
  readonly firstName: string;

  @ApiProperty({ example: 'Doe' })
  @IsNotEmpty()
  readonly lastName: string;

  @ApiProperty({ example: 'strongpassword123', minLength: 6 })
  @IsNotEmpty()
  @MinLength(6)
  readonly password: string;
}

// For user updates
export class UpdateUserDto {
  @ApiPropertyOptional({ example: 'John' })
  @IsOptional()
  @IsString()
  readonly firstName?: string;

  @ApiPropertyOptional({ example: 'Doe' })
  @IsOptional()
  @IsString()
  readonly lastName?: string;

  @ApiPropertyOptional({ example: 'admin' })
  @IsOptional()
  @IsString()
  readonly role?: string;
}

// For user login
export class LoginDto {
  @ApiProperty({ example: 'user@clarovate.io' })
  @IsEmail()
  readonly email: string;

  @ApiProperty({ example: 'strongpassword123', minLength: 6 })
  @IsNotEmpty()
  @MinLength(6)
  readonly password: string;
}

export class StatusUpdateDto{
  @ApiProperty({ example: 'true' })
  @IsBoolean()
  readonly status: boolean;
}

// For invitation redemption
export class RedeemDto {

  @ApiProperty({ example: 'Jane' })
  @IsNotEmpty()
  @IsString()
  readonly firstName: string;

  @ApiProperty({ example: 'Doe' })
  @IsNotEmpty()
  @IsString()
  readonly lastName: string;

  @ApiProperty({ example: 'securepassword', minLength: 6 })
  @IsNotEmpty()
  @MinLength(6)
  readonly password: string;

  @ApiProperty({ example: 'abc123invitationToken' })
  @IsNotEmpty()
  @IsString()
  readonly token: string;
}
