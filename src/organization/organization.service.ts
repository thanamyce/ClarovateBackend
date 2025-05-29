import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Organization, OrganizationDocument, OrganizationType } from './organization.schema';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { ConfigService } from '@nestjs/config';
import { ResponseHelper } from 'src/util/response';

@Injectable()
export class OrganizationService {
  constructor(
    @InjectModel(Organization.name) private organizationModel: Model<OrganizationDocument>,
    private configService: ConfigService
  ) {}

  // Create a new organization
  async create(createOrganizationDto: CreateOrganizationDto): Promise<Organization | any> {
    try {
        const newOrganization = new this.organizationModel(createOrganizationDto);
        const newOrg = await newOrganization.save();
        return ResponseHelper.success(newOrg,"New Organization successfully created",HttpStatus.OK)
    } catch (error) {
        return ResponseHelper.error(error,"Something went wrong",HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  // Get all organizations
  async findAll(): Promise<Organization[] | any> {
    try {
        const org = await this.organizationModel.find().exec();
        return ResponseHelper.success(org,"All organization fetched sucessfully",HttpStatus.OK)
    } catch (error) {
        return ResponseHelper.error(error,"Something went wrong",HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  // Get organization by ID
  async findOne(organizationId: string): Promise<Organization | any> {
  try {
      const organization = await this.organizationModel.findById(organizationId);
      if (!organization) throw new NotFoundException('Organization not found');
      return ResponseHelper.success(organization,"organozation successfully fetched",HttpStatus.OK);
  } catch (error) {
    return ResponseHelper.error(error,"Something went wrong",HttpStatus.INTERNAL_SERVER_ERROR)
  }
  }

  // Update organization by ID
  async update(organizationId: string, updateOrganizationDto: UpdateOrganizationDto): Promise<Organization|any> {
    try {
        const updatedOrganization = await this.organizationModel.findOneAndUpdate(
          {_id: organizationId},
          {$set: updateOrganizationDto},
          { new: true }
        );
        if (!updatedOrganization) throw new NotFoundException('Organization not found');
        return ResponseHelper.success(updateOrganizationDto,"Organization successfully updated",);
    } catch (error) {
        return ResponseHelper.error(error,"Something went wrong",HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  // Delete organization by ID
  async remove(organizationId: string): Promise<void | any> {
try {
        const organization:any = await this.organizationModel.findById(organizationId)
        if(organization.type==="INTERNAL"){
            return ResponseHelper.success(organization,"Internal Organization can not be deleted",HttpStatus.BAD_REQUEST)
        }
        const deletedOrganization = await this.organizationModel.findByIdAndDelete(organizationId);
        if (!deletedOrganization) throw new NotFoundException('Organization not found');
        return ResponseHelper.success(deletedOrganization,"Organization  successfully deleted",HttpStatus.OK)
} catch (error) {
    return ResponseHelper.error(error,"Something went wrong",HttpStatus.INTERNAL_SERVER_ERROR)
    
}
  }

  // Create default internal organization
  async createInternalOrganization() {
    const existingInternalOrg = await this.organizationModel.findOne({ 
      type: OrganizationType.INTERNAL 
    });

    if (existingInternalOrg) {
      console.log('Internal organization already exists');
      return existingInternalOrg;
    }

    const orgName = this.configService.get<string>('ORGANIZATION_NAME') || 'Clarovate';
    const orgEmail = this.configService.get<string>('ORGANIZATION_EMAIL') || 'admin@clarovate.io';
    
    const internalOrg = new this.organizationModel({
      organizationName: orgName,
      hqCountry: 'INDIA',
      contactNo: '+91 9768809833',
      email: orgEmail,
      type: OrganizationType.INTERNAL,
      createdBy: 'SYSTEM',
    });

    const organization = await internalOrg.save();
    if (organization) {
      console.log('Internal organization successfully created');
    }
    return organization;
  }
} 