import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsEmail, IsOptional, IsString, ValidateNested } from 'class-validator';

class AlternateContactDto {
  @ApiProperty({ example: 'John Doe', description: 'Name of the alternate contact' })
  name: string;

  @ApiProperty({ example: '+1987654321', description: 'Alternate contact number' })
  contactNo: string;

  @ApiProperty({ example: 'Manager', description: 'Job title of the alternate contact' })
  jobTitle: string;
}

export class UpdateClientDto {
  @ApiPropertyOptional({ example: 'Acme Corp' })
  @IsOptional()
  @IsString()
  readonly clientName?: string;

  @ApiPropertyOptional({ example: 'USA' })
  @IsOptional()
  @IsString()
  readonly hqCountry?: string;

  @ApiPropertyOptional({ example: 'AC123' })
  @IsOptional()
  @IsString()
  readonly clientCode?: string;

  @ApiPropertyOptional({ example: '+1234567890' })
  @IsOptional()
  @IsString()
  readonly clientContactNo?: string;

  @ApiPropertyOptional({ example: 'contact@acme.com' })
  @IsOptional()
  @IsEmail()
  readonly clientMail?: string;

  @ApiPropertyOptional({ example: 'chat12345' })
  @IsOptional()
  @IsString()
  readonly chatId?: string;

  @ApiPropertyOptional({ type: [AlternateContactDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AlternateContactDto)
  readonly alternateContacts?: AlternateContactDto[];

  @ApiPropertyOptional({
    example: '64a1a12bc32e4a3e8c0550b3',
    description: 'ID of the user who updated this client',
  })
  @IsOptional()
  @IsString()
  updatedBy?: string;
}