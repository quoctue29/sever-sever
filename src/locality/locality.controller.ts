import { Get, Query } from '@nestjs/common';
import { LocalityService } from './locality.service';
import { ApiTags } from '@nestjs/swagger';
import { PortalController } from '@/decorator';
import { DistrictQuery, ProvinceQuery } from './dto/locality-req.dto';

@ApiTags('Locality')
@PortalController({ path: 'locality' })
export class LocalityController {
  constructor(private readonly localityService: LocalityService) {}

  @Get('/province')
  async province(@Query() query: ProvinceQuery) {
    return this.localityService.getProvince(query);
  }

  @Get('/district')
  async district(@Query() query: ProvinceQuery) {
    return this.localityService.getDistrict(query);
  }

  @Get('/ward')
  async ward(@Query() query: DistrictQuery) {
    return this.localityService.getWard(query);
  }
}
