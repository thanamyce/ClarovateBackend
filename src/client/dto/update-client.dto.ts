import { ApiProperty } from '@nestjs/swagger';

class AlternateContactDto {
  @ApiProperty({ example: 'John Doe', description: 'Name of the alternate contact' })
  name: string;

  @ApiProperty({ example: '+1987654321', description: 'Alternate contact number' })
  contactNo: string;

  @ApiProperty({ example: 'Manager', description: 'Job title of the alternate contact' })
  jobTitle: string;
}

export class UpdateClientDto {
  @ApiProperty({ required: false })
  clientName?: string;

  @ApiProperty({ required: false })
  hqCountry?: string;

  @ApiProperty({ required: false })
  clientCode?: string;

  @ApiProperty({ required: false })
  clientContactNo?: string;

  @ApiProperty({ required: false })
  clientMail?: string;

  @ApiProperty({ required: false })
  chatId?: string;

  @ApiProperty({ required: false })
  alternateContacts?: AlternateContactDto[];

  @ApiProperty({ 
    example: '64a1a12bc32e4a3e8c0550b3', 
    description: 'ID of the user who updated this client',
    required: true
  })
  updatedBy: string;
} 