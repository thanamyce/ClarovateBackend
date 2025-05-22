import { ApiProperty } from '@nestjs/swagger';

class AlternateContactDto {
  @ApiProperty({ example: 'John Doe', description: 'Name of the alternate contact' })
  name: string;

  @ApiProperty({ example: '+1987654321', description: 'Alternate contact number' })
  contactNo: string;

  @ApiProperty({ example: 'Manager', description: 'Job title of the alternate contact' })
  jobTitle: string;
}

export class CreateClientDto {
  @ApiProperty({ example: 'TechCorp', description: 'Name of the client' })
  clientName: string;

  @ApiProperty({ example: 'USA', description: 'Headquarters country' })
  hqCountry: string;

  @ApiProperty({ example: 'Emerald', description: 'Unique client code' })
  clientCode: string;

  @ApiProperty({ example: '+1234567890', description: 'Client contact number' })
  clientContactNo: string;

  @ApiProperty({ example: 'client@example.com', description: 'Client email' })
  clientMail: string;

  @ApiProperty({ example: 'techcorp_skype', description: 'Chat ID (Skype username)' })
  chatId: string;

  @ApiProperty({ 
    type: [AlternateContactDto], 
    description: 'List of alternate contacts with name, contact number, and job title' 
  })
  alternateContacts: AlternateContactDto[];

  @ApiProperty({ 
    example: '64a1a12bc32e4a3e8c0550b3', 
    description: 'ID of the user who created this client' 
  })
  createdBy: string;
}
