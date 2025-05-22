import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Client } from './client.schema';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

@Injectable()
export class ClientService {
  constructor(
    @InjectModel(Client.name) private clientModel: Model<Client>
  ) {}

  // Simple ID generation
  private generateClientId(): string {
    return 'CL' + Date.now().toString().slice(-6);
  }

  // Create a new client
  async create(createClientDto: CreateClientDto): Promise<Client> {
    const clientId = this.generateClientId();
    const newClient = new this.clientModel({ 
      ...createClientDto, 
      _id: clientId,
      // If createdBy isn't set in the DTO, it will be null/undefined
    });
    return newClient.save();
  }

  // Get all clients
  async findAll(): Promise<Client[]> {
    return this.clientModel.find().exec();
  }

  // Get client by ID
  async findOne(clientId: string): Promise<Client> {
    const client = await this.clientModel.findById(clientId);
    if (!client) throw new NotFoundException('Client not found');
    return client;
  }

  // Update client by ID
  async update(clientId: string, updateClientDto: UpdateClientDto): Promise<Client> {
    // Ensure updatedBy is included in the update
    const updatedClient = await this.clientModel.findByIdAndUpdate(
      clientId,
      updateClientDto,
      { new: true }
    );
    if (!updatedClient) throw new NotFoundException('Client not found');
    return updatedClient;
  }

  // Delete client by ID
  async remove(clientId: string): Promise<void> {
    const deletedClient = await this.clientModel.findByIdAndDelete(clientId);
    if (!deletedClient) throw new NotFoundException('Client not found');
  }
}
