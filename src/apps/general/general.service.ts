import { Injectable } from '@nestjs/common';
import BaseService from '../base-service';
import { IResUploadFile, S3Service } from '../../services/s3.service';
import { ReturnBaseResponse } from '../../config/base-response-config';

@Injectable()
export class GeneralService extends BaseService {
  constructor(private s3Service: S3Service) {
    super();
  }

  async Upload(file: Express.Multer.File): ReturnBaseResponse<IResUploadFile> {
    return this.s3Service.Upload(file);
  }
}
