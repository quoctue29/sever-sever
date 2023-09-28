import {
  Body,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PortalController, Roles } from '@/decorator';
import { AdvertisementService } from './advertisement.service';
import { Serialize } from '@/interceptor';
import { Role } from '@/common';
import {
  AdvertisementActive,
  AdvertisementReqDto,
  AdvertisementResDto,
} from './dto';
import { JwtAuthGuard } from '@/auth/guard';
import { isValidObjectId } from '@/utils';
import { AdvertisementQuery } from './dto/advertisement-query.dto';

@ApiTags('Advertisement')
@PortalController({ path: 'advertisement' })
export class AdvertisementController {
  private readonly logger = new Logger(AdvertisementController.name);
  constructor(private advertisementService: AdvertisementService) {}

  @Get('/')
  public async getListAuthor(@Query() query: AdvertisementQuery): Promise<any> {
    this.logger.debug(`Rest to get list advertisement info`);
    return this.advertisementService.getListAdvertisement(query);
  }

  @Post('/')
  @Serialize(AdvertisementResDto)
  @UseGuards(JwtAuthGuard)
  @Roles(Role.SYSTEM_ADMIN, Role.ADMIN)
  public async createAdvertisement(
    @Body() dto: AdvertisementReqDto,
  ): Promise<AdvertisementResDto> {
    this.logger.debug(`Rest to create advertisement`);
    return await this.advertisementService.createAdvertisement(dto);
  }

  @Put('/info/:id')
  @Serialize(AdvertisementResDto)
  @UseGuards(JwtAuthGuard)
  @Roles(Role.SYSTEM_ADMIN, Role.ADMIN)
  public async updateAuthor(
    @Body() dto: AdvertisementReqDto,
    @Param('id') id: string,
  ): Promise<AdvertisementResDto> {
    isValidObjectId(id);
    this.logger.debug(`Rest to update author by id: ${id}`);
    return await this.advertisementService.updateAdvertisement(dto, id);
  }

  @Put('/is-active/:id')
  @Serialize(AdvertisementResDto)
  @UseGuards(JwtAuthGuard)
  @Roles(Role.SYSTEM_ADMIN, Role.ADMIN)
  public async isActive(
    @Body() dto: AdvertisementActive,
    @Param('id') id: string,
  ): Promise<AdvertisementResDto> {
    isValidObjectId(id);
    this.logger.debug(`Rest to update author by id: ${id}`);
    return await this.advertisementService.isActive(dto, id);
  }

  @Delete('/:id')
  @UseGuards(JwtAuthGuard)
  @Roles(Role.SYSTEM_ADMIN, Role.ADMIN)
  public async deleteAuthor(@Param('id') id: string): Promise<any> {
    isValidObjectId(id);
    this.logger.debug(`Rest to delete author by id: ${id}`);
    return await this.advertisementService.deleteAdvertisement(id);
  }

  @Get('/:id')
  @Serialize(AdvertisementResDto)
  public async getAdvertisementById(
    @Param('id') id: string,
  ): Promise<AdvertisementResDto> {
    isValidObjectId(id);
    this.logger.debug(`Rest to get advertisement by id ${id}`);
    return this.advertisementService.getAdvertisementById(id);
  }
}
