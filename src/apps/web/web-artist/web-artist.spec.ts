import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../../../app.module';
import * as request from 'supertest';
import { HttpStatusCode } from 'axios';
import { UtilsHelper } from '../../../helper/utils-helper';
import {
  getRandomArtistTest,
  getRandomCategoriesTesting,
  getRandomImageUrlTest,
  ISetToken,
  loginCmsTest,
  setTokenTest,
} from '../../../utils/testing-utils';
import { ICreateLyricsDto } from '../../../dto/request/lyrics-request/ICreateLyricsDto';
import { faker } from '@faker-js/faker';
import { IDetailLyricResponse } from '../../../dto/response/lyric-response/IDetailLyricResponse';
import { StatusEnum } from '../../../enum/status-enum';
import { IReqRejectRevisionLyric } from '../../../dto/request/lyrics-request/IReqRejectRevisionLyric';

describe('WEB ARTIST TEST', () => {
  let app: INestApplication;
  let token: ISetToken;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    const authToken = await loginCmsTest(app);
    token = setTokenTest(authToken);
  });

  afterAll(async () => {
    await app.close();
  });
  it('should get detail lyric by slug', function () {
    const slug = 'unit-test';
    return request(app.getHttpServer())
      .get(`/web/artist/v1/detail/${slug}`)
      .set(token.auth, token.token)
      .then((res) => {
        expect(res.status).toEqual(HttpStatusCode.Ok);
        expect(res.body.response_data.slug).toEqual(slug);
      });
  });
});
