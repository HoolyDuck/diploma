import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

import { PrismaService } from 'src/prisma/prisma.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class FilesService {
  private readonly uploadDir = path.join(__dirname, '..', 'uploads');

  constructor(private prisma: PrismaService) {
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  async saveFile(file: Express.Multer.File) {
    const uniqueFileName = `${uuidv4()}-${file.originalname}`;
    const filePath = path.join(this.uploadDir, uniqueFileName);
    console.log(`Saving file to: ${filePath}`);
    const fileBuffer = Buffer.from(file.buffer);
    fs.writeFileSync(filePath, fileBuffer);

    const savedFile = await this.prisma.file.create({
      data: {
        originalName: file.originalname,
        mimetype: file.mimetype,
        path: filePath,
        size: file.size,
      },
    });

    return savedFile;
  }

  async getFileById(id: string): Promise<{
    buffer: Buffer;
    mimetype: string;
    originalName: string;
  } | null> {
    const file = await this.prisma.file.findUnique({ where: { id } });

    if (!file || !fs.existsSync(file.path)) {
      return null;
    }

    const buffer = fs.readFileSync(file.path);

    return {
      buffer,
      mimetype: file.mimetype,
      originalName: file.originalName,
    };
  }
}
