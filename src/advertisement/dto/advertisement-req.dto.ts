import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDate, IsString } from 'class-validator';

export class AdvertisementReqDto {
  @ApiProperty()
  @IsString()
  link: string;

  @ApiProperty()
  @IsString()
  image: string;
}

export class AdvertisementActive {
  @ApiProperty()
  @IsBoolean()
  isActive: boolean;
}
