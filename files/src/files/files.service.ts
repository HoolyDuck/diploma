import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

import { PrismaService } from 'src/prisma/prisma.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class FilesService {
  private readonly uploadDir = path.join(__dirname, '..', 'uploads');
  private fileSignature = new Map<
    string,
    {
      token: string;
      expiresAt: Date;
    }
  >();

  constructor(private prisma: PrismaService) {
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  generateFileSignature(): string {
    const token = uuidv4();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    this.fileSignature.set(token, { token, expiresAt });

    return token;
  }

  private verifyFileSignature(token: string) {
    const signature = this.fileSignature.get(token);

    if (!signature || signature.expiresAt < new Date()) {
      this.invalidateFileSignature(token);
      return false;
    }

    return true;
  }

  private invalidateFileSignature(token: string): void {
    if (this.fileSignature.has(token)) {
      this.fileSignature.delete(token);
    }
  }

  async saveFile(file: Express.Multer.File, token: string) {
    const signatureValid = this.verifyFileSignature(token);
    if (!signatureValid) {
      throw new UnauthorizedException('Invalid or expired file signature');
    }

    this.invalidateFileSignature(token);

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

  async getFileById(
    id: string,
    token: string,
  ): Promise<{
    buffer: Buffer;
    mimetype: string;
    originalName: string;
  } | null> {
    const signature = this.verifyFileSignature(token);

    if (!signature) {
      throw new UnauthorizedException('Invalid or expired file signature');
    }

    const file = await this.prisma.file.findUnique({ where: { id } });

    if (!file || !fs.existsSync(file.path)) {
      return null;
    }

    const buffer = fs.readFileSync(file.path);

    this.invalidateFileSignature(token);

    return {
      buffer,
      mimetype: file.mimetype,
      originalName: file.originalName,
    };
  }

  async getFileInfoById(id: string): Promise<{
    id: string;
    originalName: string;
    mimetype: string;
    size: number;
    url: string;
  } | null> {
    const file = await this.prisma.file.findUnique({ where: { id } });

    if (!file) {
      return null;
    }

    return {
      id: file.id,
      originalName: file.originalName,
      mimetype: file.mimetype,
      size: file.size,
      url: `/files/${id}`, // Assuming you have a route to serve files
    };
  }

  async getFileInfosByIds(ids: string[]): Promise<
    {
      id: string;
      originalName: string;
      mimetype: string;
      size: number;
      url: string;
    }[]
  > {
    const files = await this.prisma.file.findMany({
      where: { id: { in: ids } },
    });

    return files.map((file) => ({
      id: file.id,
      originalName: file.originalName,
      mimetype: file.mimetype,
      size: file.size,
      url: `/files/${file.id}`, // Assuming you have a route to serve files
    }));
  }
}
