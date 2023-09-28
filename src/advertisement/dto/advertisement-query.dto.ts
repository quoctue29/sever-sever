import { PaginationQuery, SortEnum } from '@/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class AdvertisementQuery extends PaginationQuery {
  // @ApiProperty({ required: false })
  // @IsString()
  // @IsOptional()
  // public name?: string;

  @ApiProperty({ required: false, default: -1 })
  @IsOptional()
  public sortCreatedAt?: SortEnum;
}
