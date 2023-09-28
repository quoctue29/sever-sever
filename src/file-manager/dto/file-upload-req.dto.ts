import { Express } from 'express';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class FileUploadDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'The file to upload',
  })
  @IsNotEmpty({ message: 'File should not be empty' })
  file: Express.Multer.File;
}
