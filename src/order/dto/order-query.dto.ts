import {
  PaginationQuery,
  SortEnum,
  StatisticalEnum,
  statusOrder,
} from '@/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class OrderQuery extends PaginationQuery {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  public email?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  recipientName?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({ required: false })
  @IsEnum(statusOrder)
  @IsOptional()
  status: statusOrder;

  @ApiProperty({ required: false, default: -1 })
  @IsOptional()
  public sortCreatedAt?: SortEnum;
}

export class StatisticalOrderQuery {
  @ApiProperty({ default: StatisticalEnum.TODAY })
  @IsEnum(StatisticalEnum)
  public statisticalBy: StatisticalEnum;

  @ApiProperty({ default: statusOrder.IN_PROGRESS })
  @IsEnum(statusOrder)
  public status: statusOrder;
}

export class OrderHistoryQuery extends PaginationQuery {
  @ApiProperty({ required: false, default: -1 })
  @IsOptional()
  public sortCreatedAt?: SortEnum;
}
