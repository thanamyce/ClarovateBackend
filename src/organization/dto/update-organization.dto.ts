import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateOrganizationDto } from './create-organization.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateOrganizationDto extends PartialType(CreateOrganizationDto) {
  @ApiProperty({ example: '64a1a12bc32e4a3e8c0550b3' })
  @IsString()
  @IsOptional()
  updatedBy?: string;
} 