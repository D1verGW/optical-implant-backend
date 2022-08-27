import { Controller, Get, Post, Req } from '@nestjs/common';
import { OcrService } from '../tesseract-ocr/ocr.service';

type Rect2D = {
  width: number;
  height: number;
}

type RecognizeMatrixRequestDTO = {
  body: {
    data: {
      image: string,
      imageParams: Rect2D,
    },
    lang: string,
  }
}


@Controller()
export class AppController {
  constructor(private readonly ocrService: OcrService) {}

  @Post('/recognize')
  async recognize(@Req() req: RecognizeMatrixRequestDTO) {

    const { body } = req;

    const imageData = body.data.image;
    const imageParams = body.data.imageParams;
    const lang = body.lang;

    return this.ocrService.recognize(imageData, lang, imageParams.width, imageParams.height);
  }

  @Get('/wake-up-neo')
  async wakeUp(@Req() req: RecognizeMatrixRequestDTO) {
    // Method to wake-up heroku server infrastructure
    return "The matrix has you!";
  }
}
