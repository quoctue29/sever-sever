import { CartReqDto } from '@/cart/dto';
import { statusOrder } from '@/common';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsDate, IsEnum, IsNumber, IsObject, IsString } from 'class-validator';

export class OrderResDto {
  constructor(partial: Partial<OrderResDto>) {
    Object.assign(this, partial);
  }

  @ApiProperty()
  @Expose()
  @IsObject()
  cart: CartReqDto[];

  @ApiProperty()
  @Expose()
  @IsNumber()
  totalProduct: number;

  @ApiProperty()
  @Expose()
  @IsNumber()
  totalPrice: number;

  @ApiProperty()
  @Expose()
  @IsString()
  recipientName: string;

  @ApiProperty()
  @Expose()
  @IsString()
  email: string;

  @ApiProperty()
  @Expose()
  @IsString()
  phone: string;

  @ApiProperty()
  @Expose()
  @IsString()
  province: string;

  @ApiProperty()
  @Expose()
  @IsString()
  district: string;

  @ApiProperty()
  @Expose()
  @IsString()
  wards: string;

  @ApiProperty()
  @Expose()
  @IsString()
  address: string;

  @ApiProperty()
  @Expose()
  @IsEnum(statusOrder)
  status: statusOrder;

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
