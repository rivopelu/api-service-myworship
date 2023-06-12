import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Media } from '@entities/Media';
import { S3 } from 'aws-sdk';

import { v4 as uuidv4 } from 'uuid';
import { ENV } from '@constants/ENV';
import BaseService from '@apps/base-service';
import {
  ReturnBaseResponse,
  ReturnResponseWithMessage,
} from '@config/base-response-config';

@Injectable()
export class S3Service extends BaseService {
  private readonly region: string;
  private readonly accessKeyId;
  private readonly secretKeyId;
  private readonly bucketName;
  private readonly folder;

  constructor(
    @InjectRepository(Media)
    private mediaRepository: Repository<Media>,
  ) {
    super();
    this.region = ENV.AWS.REGION;
    this.accessKeyId = ENV.AWS.ACCESS_KEY;
    this.secretKeyId = ENV.AWS.SECRET_KEY;
    this.bucketName = ENV.AWS.BUCKET;
    this.folder = ENV.AWS.FOLDER_S3;
  }

  getLinkMediaKey(mediaKey: Express.Multer.File) {
    const s3 = this.getS3();
    return s3.getSignedUrl('getObject', {
      Key: this.folder + '/' + mediaKey,
      Bucket: this.bucketName,
    });
  }

  async updateAcl(mediaId: string): Promise<string> {
    const media = await this.mediaRepository.findOne({
      where: { uuid: mediaId },
    });
    const s3 = this.getS3();
    s3.putObject({
      Bucket: this.bucketName,
      Key: this.folder + '/' + media.key,
      ACL: 'public-read',
    });
    return (
      s3.endpoint.protocol +
      '//' +
      this.bucketName +
      '.' +
      s3.endpoint.hostname +
      '/' +
      media.key
    );
  }

  async Upload(file: any): ReturnBaseResponse<IResUploadFile> {
    const objectId = uuidv4();
    const arr_name = file.originalname.split('.');
    const extension = arr_name.pop();
    const name = arr_name.join('.');
    const key = objectId + name.replace(' ', '-') + '.' + extension;
    const successUpload = await this.uploadS3(
      file.buffer,
      key,
      file.mimetype,
    ).then();
    if (successUpload) {
      const newMedia = await this.mediaRepository.save({
        uuid: objectId,
        key: this.folder + '/' + key,
        fileName: String(file.originalname),
        size: file.size,
        mimeType: file.mimetype,
      });
      if (newMedia) {
        const url = await this.updateAcl(newMedia.uuid);
        return this.baseResponse.BaseResponse<IResUploadFile>({
          name: String(file.originalname),
          url: url,
          mime_type: file.mimetype,
          size: file.size,
        });
      }
    }
  }

  async deleteFileS3(mediaId: string): ReturnResponseWithMessage {
    const media = await this.mediaRepository.findOne({
      where: { uuid: mediaId },
    });
    const s3 = this.getS3();
    if (media) {
      const params: S3.Types.DeleteObjectRequest = {
        Bucket: this.bucketName,
        Key: this.folder + '/' + media.key,
      };
      s3.deleteObject(params, (err, data) => {
        if (err) {
          this.logger.error(err.message);
        } else {
          this.logger.verbose('SUCCESS SAVE FILE');
        }
      });
      await this.mediaRepository.delete({ id: media.id });
      return this.baseResponse.BaseResponseWithMessage(
        'Success deleted assets in AWS S3',
      );
    }
  }

  private async uploadS3(fileBuffer, key, contentType) {
    const s3 = this.getS3();
    const params: S3.Types.PutObjectRequest = {
      Bucket: this.bucketName,
      Key: this.folder + '/' + key,
      Body: fileBuffer,
      ContentType: contentType,
      ACL: 'public-read-write',
    };
    return new Promise((resolve, reject) => {
      s3.upload(params, (err, data) => {
        if (err) {
          reject(err.message);
          this.logger.error(err.message);
          throw new InternalServerErrorException(err.message.toString());
        } else {
          resolve(data);
        }
      });
    });
  }

  private getS3() {
    return new S3({
      region: this.region,
      credentials: {
        accessKeyId: this.accessKeyId,
        secretAccessKey: this.secretKeyId,
      },
    });
  }
}

export interface IResUploadFile {
  name: string;
  url: string;
  size: number;
  mime_type: string;
}
