import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { GeneralService } from '@apps/general/general.service';

@Controller('')
export class GeneralController {
  constructor(private generalService: GeneralService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  Upload(@UploadedFile() file: Express.Multer.File) {
    return this.generalService.Upload(file);
  }
}
