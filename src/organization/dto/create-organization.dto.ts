import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsEnum,
} from 'class-validator';
import { OrganizationType } from '../organization.schema';

export class CreateOrganizationDto {
  @ApiProperty({ example: 'TechCorp' })
  @IsString()
  @IsNotEmpty()
  organizationName: string;

  @ApiProperty({ example: 'USA' })
  @IsString()
  @IsNotEmpty()
  hqCountry: string;

  @ApiProperty({ example: '+1234567890' })
  @IsString()
  @IsNotEmpty()
  contactNo: string;

  @ApiProperty({ example: 'org@techcorp.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'CLIENT', enum: OrganizationType })
  @IsEnum(OrganizationType)
  @IsNotEmpty()
  type: OrganizationType;

} 