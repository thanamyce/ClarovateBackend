import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsOptional,
  ValidateNested,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';

class AlternateContactDto {
  @ApiProperty({ example: 'John Doe' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: '+1987654321' })
  @IsString()
  @IsNotEmpty()
  contactNo: string;

  @ApiProperty({ example: 'Manager' })
  @IsString()
  @IsNotEmpty()
  jobTitle: string;
}

export class CreateClientDto {
  @ApiProperty({ example: 'TechCorp' })
  @IsString()
  @IsNotEmpty()
  clientName: string;

  @ApiProperty({ example: 'USA' })
  @IsString()
  @IsNotEmpty()
  hqCountry: string;

  @ApiProperty({ example: 'EM123' })
  @IsString()
  @IsNotEmpty()
  clientCode: string;

  @ApiProperty({ example: '+1234567890' })
  @IsString()
  @IsNotEmpty()
  clientContactNo: string;

  @ApiProperty({ example: 'client@techcorp.com' })
  @IsEmail()
  @IsNotEmpty()
  clientMail: string;

  @ApiProperty({ example: 'techcorp_skype' })
  @IsString()
  @IsOptional()
  chatId?: string;

  @ApiProperty({ type: [AlternateContactDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AlternateContactDto)
  @IsOptional()
  alternateContacts?: AlternateContactDto[];

  @ApiProperty({ example: '64a1a12bc32e4a3e8c0550b3' })
  createdBy: string;
}
