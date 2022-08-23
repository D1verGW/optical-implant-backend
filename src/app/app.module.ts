import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { OcrService } from '../tesseract-ocr/ocr.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [OcrService],
})
export class AppModule {}
