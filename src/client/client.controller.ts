import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ClientService } from './client.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { ReqUser } from 'src/util/decorates';
import { AuthGuard } from 'src/auth/auth.guard';

import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';

@Controller()
@ApiTags('Clients') // Grouped as "Clients" in Swagger
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Post('client')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Create a new client' })
  @ApiBody({ type: CreateClientDto })
  @ApiResponse({ status: 201, description: 'Client created successfully' })
  @ApiBearerAuth()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  create(@Body() createClientDto: CreateClientDto, @ReqUser() reqUser: any) {
    if (reqUser && reqUser.id) {
      createClientDto.createdBy = reqUser.id;
    }
    return this.clientService.create(createClientDto);
  }

  @Get('clients')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Get all clients' })
  @ApiResponse({ status: 200, description: 'List of clients retrieved successfully' })
  @ApiBearerAuth()
  findAll() {
    return this.clientService.findAll();
  }

  @Get('client/:id')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Get client by ID' })
  @ApiParam({ name: 'id', description: 'Client ID' })
  @ApiResponse({ status: 200, description: 'Client retrieved successfully' })
  @ApiBearerAuth()
  findOne(@Param('id') id: string) {
    return this.clientService.findOne(id);
  }

  @Patch('client/:id')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Update client by ID' })
  @ApiParam({ name: 'id', description: 'Client ID' })
  @ApiBody({ type: UpdateClientDto })
  @ApiResponse({ status: 200, description: 'Client successfully updated' })
  @ApiBearerAuth()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async update(
    @Param('id') id: string,
    @Body() updateClientDto: UpdateClientDto,
    @ReqUser() reqUser: any,
  ) {
    if (reqUser && reqUser.id) {
      updateClientDto.updatedBy = reqUser.id;
    }
    const updatedClient = await this.clientService.update(id, updateClientDto);
    return {
      message: 'Client successfully updated',
      client: updatedClient,
    };
  }

  @Delete('client/:id')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Delete client by ID' })
  @ApiParam({ name: 'id', description: 'Client ID' })
  @ApiResponse({ status: 200, description: 'Client successfully deleted' })
  @ApiBearerAuth()
  remove(@Param('id') id: string) {
    this.clientService.remove(id);
    return {
      message: 'Client successfully deleted',
    };
  }
}
