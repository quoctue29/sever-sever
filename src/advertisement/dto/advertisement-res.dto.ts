import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsBoolean, IsDate, IsString } from 'class-validator';

export class AdvertisementResDto {
  constructor(partial: Partial<AdvertisementResDto>) {
    Object.assign(this, partial);
  }
  @ApiProperty()
  @Expose()
  @IsBoolean()
  isActive: boolean;

  @ApiProperty()
  @Expose()
  @IsString()
  link: string;

  @ApiProperty()
  @Expose()
  @IsString()
  image: string;

  @ApiProperty()
  @Expose()
  @IsDate()
  createdAt?: Date;

  @ApiProperty()
  @Expose()
  @IsDate()
  updatedAt?: Date;

  @ApiProperty()
  @Expose()
  @IsString()
  id?: string;
}
