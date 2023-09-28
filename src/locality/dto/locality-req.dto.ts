import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class ProvinceQuery {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  public province?: string;

  @ApiProperty({ required: false, type: Number })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  itemsPerPage?: number;

  @ApiProperty({ required: false, default: 1, type: Number })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  currentPage? = 1;
}

export class DistrictQuery {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  public province?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  public district?: string;

  @ApiProperty({ required: false, type: Number })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  itemsPerPage?: number;

  @ApiProperty({ required: false, default: 1, type: Number })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  currentPage? = 1;
}
