import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsMongoId,
  IsNumber,
  IsOptional,
  ValidateNested,
} from 'class-validator';

export class ListProductReq {
  @ApiProperty()
  @Expose()
  @IsMongoId()
  productId: string;

  @ApiProperty({ default: 1, type: Number })
  @Expose()
  @IsNumber()
  amount: 1;

  @ApiProperty()
  @Expose()
  @IsBoolean()
  IsSelected: boolean;
}

export class ListProductRes {
  @ApiProperty()
  @Expose()
  @IsMongoId()
  productId: string;

  @ApiProperty()
  @Expose()
  @IsNumber()
  amount: number;

  @ApiProperty()
  @Expose()
  @IsNumber()
  unitPrice: number;

  @ApiProperty()
  @Expose()
  @IsBoolean()
  IsSelected: boolean;
}

export class CartReqDto {
  @ApiProperty({ type: [ListProductReq] })
  @Expose()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ListProductReq)
  @IsOptional()
  productIds?: ListProductReq[];

  constructor(partial: Partial<CartReqDto>) {
    Object.assign(this, partial);
  }
}
