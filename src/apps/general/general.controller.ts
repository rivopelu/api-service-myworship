import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { GeneralService } from './general.service';
import { ApiTags } from '@nestjs/swagger';
@ApiTags('GENERAL CONTROLLER')
@Controller('')
export class GeneralController {
  constructor(private generalService: GeneralService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  Upload(@UploadedFile() file: Express.Multer.File) {
    return this.generalService.Upload(file);
  }
}
