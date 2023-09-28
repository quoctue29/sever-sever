import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { createReadStream, existsSync } from 'fs';
import { readdir, stat, unlink } from 'fs/promises';
import { formatBytes } from '@/utils';
import { ServerMessage } from '@/common';

@Injectable()
export class FileManagerService {
  constructor(private readonly configService: ConfigService) {}
  private readonly name: string = 'file';
  private readonly pathFolder: string = process.env.PWD + '/file-manager';
  private readonly publicUrl: string = this.configService.get('PUBLIC_URL');

  async streamFile(res: Response, path: string) {
    const file = createReadStream(path);
    file.pipe(res as any);
  }

  isExisted(path: string) {
    return existsSync(path);
  }

  async getFile(res: Response, fileName: string): Promise<void> {
    const path = `${this.pathFolder}/${fileName}`;
    const type = path.slice(path.lastIndexOf('.') + 1, path.length);
    res.setHeader('Content-Type', `image/${type}`);
    if (!this.isExisted(path)) {
      throw new NotFoundException(this.name.concat(ServerMessage.NOT_FOUND));
    }
    await this.streamFile(res, path);
  }

  async delete(name: string) {
    const imagePath = `${this.pathFolder}/${name}`;

    return unlink(imagePath)
      .then(async () => ({ success: true }))
      .catch(() => {
        throw new NotFoundException(this.name.concat(ServerMessage.NOT_FOUND));
      });
  }

  async getListFile() {
    const fileNames = await readdir(this.pathFolder);
    let files: {
      name: string;
      sizeInBytes: number;
      sizeInString: string;
      url: string;
    }[] = [];

    await Promise.all(
      fileNames.map(async (fileName) => {
        const ignoreFiles = ['README.md', '.DS_Store'];
        if (ignoreFiles.includes(fileName)) return;

        const stats = await stat(`${this.pathFolder}/${fileName}`);

        files.push({
          name: fileName,
          sizeInBytes: stats.size,
          sizeInString: formatBytes(stats.size),
          url: `${this.publicUrl}/api/file-manager/${fileName}`,
        });
      }),
    );

    const totalSizeInBytes = files.reduce((a, b) => a + b.sizeInBytes, 0);

    return {
      totalSizeInBytes,
      totalSizeInString: formatBytes(totalSizeInBytes),
      count: files.length,
      data: files,
    };
  }
}
