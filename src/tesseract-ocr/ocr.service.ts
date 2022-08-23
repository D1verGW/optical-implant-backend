import { Injectable, Logger } from '@nestjs/common';
import { join } from 'path';
import { createWorker, ImageLike, OEM, PSM, WorkerParams } from 'tesseract.js';

@Injectable()
export class OcrService {
    private readonly logger = new Logger(OcrService.name);
    private localLanguages = ['cyber'];
    private workerParams: Partial<WorkerParams> = {
        tessedit_pageseg_mode: PSM.SINGLE_BLOCK,
        tessedit_ocr_engine_mode: OEM.LSTM_ONLY,
    };
    private workers = new Map<string, ReturnType<typeof createWorker>>();

    public async recognize(image: ImageLike, lang: string, width: number, height: number) {
        const worker = await this.createWorker(lang, this.workerParams);

        return await worker.recognize(image, {
            rectangle: { left: 0, top: 0, width, height },
        });
    }

    private async createWorker(lang: string, params: Partial<WorkerParams>) {
        if (this.workers.get(lang)) {
            return this.workers.get(lang);
        }

        const workerParams = {
            logger: args => this.logger.log({ ...args }),
            ...(this.localLanguages.includes(lang) ? { langPath: join(__dirname, '..', '/lang') } : {})
        }

        const worker = createWorker(workerParams);

        await worker.load();
        await worker.loadLanguage(lang);
        await worker.initialize(lang);
        await worker.setParameters(params);

        this.workers.set(lang, worker)

        return worker;
    }
}
