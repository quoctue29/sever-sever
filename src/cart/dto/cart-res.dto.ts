import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsString, IsDate, IsNumber, IsArray } from 'class-validator';
import { ListProductRes } from './cart-req.dto';
import { User } from '@/users/schema/user.schema';

export class CartResDto {
  @ApiProperty()
  @Expose()
  user: User;

  @ApiProperty()
  @Expose()
  @IsString()
  email: string;

  @ApiProperty()
  @Expose()
  @IsArray()
  productIds: ListProductRes[];

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

  constructor(partial: Partial<CartResDto>) {
    Object.assign(this, partial);
  }
}
