import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { PaginationQuery, StatisticalEnum } from '../../common';
import { SortEnum } from '../../common';

export class UserQuery extends PaginationQuery {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  public email?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  public userName?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  public fullName?: string;

  @ApiProperty({ required: false, default: -1 })
  @IsOptional()
  public sortCreatedAt?: SortEnum;
}

export class StatisticalUserQuery {
  @ApiProperty({ default: StatisticalEnum.TODAY })
  @IsEnum(StatisticalEnum)
  public statisticalBy: StatisticalEnum;
}
