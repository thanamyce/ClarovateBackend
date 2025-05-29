import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { ApiOperation, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { UserRole } from 'src/user/user.schema';
import { AuthAdmin } from 'src/auth/auth.admin';
import { AuthGuard } from 'src/auth/auth.guard';
import { ReqUser } from 'src/util/decorates';

@ApiTags('Organizations')
@Controller('organization')
@ApiBearerAuth()
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

  @Post()
  @UseGuards(AuthAdmin)
  @ApiOperation({ summary: 'Create a new organization (Admin only)' })
  create(@Body() createOrganizationDto: CreateOrganizationDto, @ReqUser() reqUser: any) {
    // Set createdBy to the authenticated user's ID
    const newOrg:any = createOrganizationDto;
    newOrg.createdBy = reqUser.id;
    return this.organizationService.create(newOrg);
  }

  @Get()
  @UseGuards(AuthAdmin)
  @ApiOperation({ summary: 'Get all organizations (Authenticated users)' })
  findAll() {
    return this.organizationService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthAdmin)
  @ApiOperation({ summary: 'Get organization by ID (Authenticated users)' })
  findOne(@Param('id') id: string) {
    return this.organizationService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthAdmin)
  @ApiOperation({ summary: 'Update organization by ID (Admin only)' })
  update(@Param('id') id: string, @Body() updateOrganizationDto: UpdateOrganizationDto, @ReqUser() reqUser: any) {
    // Set updatedBy to the authenticated user's ID
    updateOrganizationDto.updatedBy = reqUser.id;
    return this.organizationService.update(id, updateOrganizationDto);
  }

  @Delete(':id')
  @UseGuards(AuthAdmin)
  @ApiOperation({ summary: 'Delete organization by ID (Admin only)' })
  remove(@Param('id') id: string) {
    return this.organizationService.remove(id);
  }
} 