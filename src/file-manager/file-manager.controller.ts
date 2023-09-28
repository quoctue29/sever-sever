import {
  Controller,
  Delete,
  Get,
  Logger,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Response } from 'express';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { PortalController } from '@/decorator';
import { DateTimeUtils, StringUtils } from '@/utils';
import { FileUploadDto } from './dto';
import { FileManagerService } from './file-manager.service';

@ApiTags('File Manager')
@PortalController({ path: 'file-manager' })
export class FileManagerController {
  private readonly logger = new Logger(FileManagerController.name);
  constructor(
    private readonly configService: ConfigService,
    private fileManagerService: FileManagerService,
  ) {}

  @Get('/files')
  getFiles() {
    this.logger.debug(`Rest to get list file`);
    return this.fileManagerService.getListFile();
  }

  @Get('/:fileName')
  getFile(@Res() res: Response, @Param('fileName') fileName: string) {
    this.logger.debug(`Rest to get file by file name`);
    return this.fileManagerService.getFile(res, fileName);
  }

  @Post('/upload')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Upload a file',
    type: FileUploadDto,
  })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: process.env.PWD + '/file-manager',
        filename(_, file, cb) {
          const fileExtension = file.originalname.slice(
            file.originalname.lastIndexOf('.'),
            file.originalname.length,
          );
          const fileName = `${StringUtils.toSlug(
            file.originalname.slice(0, file.originalname.lastIndexOf('.')),
          )}-${DateTimeUtils.timeToSeconds()}${fileExtension}`;
          file['filename'] = fileName;
          cb(null, fileName);
        },
      }),
    }),
  )
  uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 1024 * 1024 * 5,
            message: 'File size limit reached',
          }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    this.logger.debug(`Rest to upload file`);
    return {
      fileName: file.filename,
      url: `${this.configService.get<string>(
        'PUBLIC_URL',
      )}/api/v1/file-manager/${file.filename}`,
      path: `/file-manager/${file.filename}`,
    };
  }

  @Delete('/:fileName')
  deleteFile(@Param('fileName') fileName: string) {
    this.logger.debug(`Rest to delete file by file name`);
    return this.fileManagerService.delete(fileName);
  }
}
