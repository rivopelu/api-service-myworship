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
  getRandomYoutubeUrl,
  ISetToken,
  loginCmsTest,
  setTokenTest,
} from '../../../utils/testing-utils';
import { ICreateLyricsDto } from '../../../dto/request/lyrics-request/ICreateLyricsDto';
import { faker } from '@faker-js/faker';
import { IDetailLyricResponse } from '../../../dto/response/lyric-response/IDetailLyricResponse';
import { StatusEnum } from '../../../enum/status-enum';
import { IReqRejectRevisionLyric } from '../../../dto/request/lyrics-request/IReqRejectRevisionLyric';

describe('CMS LYRIC TEST', () => {
  let app: INestApplication;
  let token: ISetToken;
  const utilsHelper = new UtilsHelper();

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
    const slug = 'unit-test-lyrics';
    return request(app.getHttpServer())
      .get(`/cms/lyrics/v1/detail/${slug}`)
      .set(token.auth, token.token)
      .then((res) => {
        expect(res.status).toEqual(HttpStatusCode.Ok);

        expect(res.body.response_data.slug).toEqual(slug);
      });
  });
  it('should create and publish', async function () {
    const data: ICreateLyricsDto = {
      title: `TEST-PUBLISH - ${faker.person.firstName()} - ${new Date().getTime()}`,
      image: getRandomImageUrlTest(),
      categories_id: getRandomCategoriesTesting(),
      notes: faker.lorem.text(),
      artist_slug: getRandomArtistTest(),
      description: faker.lorem.text(),
      youtube_url: getRandomYoutubeUrl(),
      lyric: faker.lorem.lines(10),
    };
    const resCreate = await request(app.getHttpServer())
      .post('/cms/lyrics/v1/new')
      .send(data)
      .set(token.auth, token.token)
      .then((res) => {
        expect(res.status).toEqual(HttpStatusCode.Ok);
        return true;
      });
    if (resCreate) {
      const slug = utilsHelper.generateSlug(data.title);
      const getDetail = await request(app.getHttpServer())
        .get('/cms/lyrics/v1/detail/' + slug)
        .set(token.auth, token.token)
        .then((res) => {
          expect(res.status).toEqual(HttpStatusCode.Ok);
          expect(res.body.response_data.slug).toEqual(slug);
          expect(res.body.response_data.status_enum).toEqual(
            StatusEnum.PENDING,
          );
          const data: IDetailLyricResponse = res.body.response_data;
          return data;
        });
      if (getDetail) {
        const successPublish = await request(app.getHttpServer())
          .patch('/cms/lyrics/v1/approved/' + getDetail.slug)
          .set(token.auth, token.token)
          .then((res) => {
            expect(res.status).toEqual(HttpStatusCode.Ok);
            return true;
          });
        if (successPublish) {
          return request(app.getHttpServer())
            .get('/cms/lyrics/v1/detail/' + utilsHelper.generateSlug(slug))
            .set(token.auth, token.token)
            .then((res) => {
              expect(res.body.response_data.slug).toEqual(
                utilsHelper.generateSlug(slug),
              );
              expect(res.body.response_data.status_enum).toEqual(
                StatusEnum.PUBLISH,
              );
            });
        }
      }
    }
  });
  it('should create and reject', async function () {
    const data: ICreateLyricsDto = {
      title: `TEST-REJECT - ${faker.person.firstName()} - ${new Date().getTime()}`,
      image: getRandomImageUrlTest(),
      categories_id: getRandomCategoriesTesting(),
      notes: faker.lorem.text(),
      artist_slug: getRandomArtistTest(),
      description: faker.lorem.text(),
      lyric: faker.lorem.lines(10),
      youtube_url: getRandomYoutubeUrl(),
    };
    const resCreate = await request(app.getHttpServer())
      .post('/cms/lyrics/v1/new')
      .send(data)
      .set(token.auth, token.token)
      .then((res) => {
        expect(res.status).toEqual(HttpStatusCode.Ok);
        return true;
      });
    if (resCreate) {
      const slug = utilsHelper.generateSlug(data.title);
      const getDetail = await request(app.getHttpServer())
        .get('/cms/lyrics/v1/detail/' + slug)
        .set(token.auth, token.token)
        .then((res) => {
          expect(res.status).toEqual(HttpStatusCode.Ok);
          expect(res.body.response_data.slug).toEqual(slug);
          expect(res.body.response_data.status_enum).toEqual(
            StatusEnum.PENDING,
          );
          const data: IDetailLyricResponse = res.body.response_data;
          return data;
        });
      if (getDetail) {
        const dataRejectRevision: IReqRejectRevisionLyric = {
          reason: faker.lorem.word(),
        };
        const successPublish = await request(app.getHttpServer())
          .put('/cms/lyrics/v1/reject/' + getDetail.slug)
          .send(dataRejectRevision)
          .set(token.auth, token.token)
          .then((res) => {
            expect(res.status).toEqual(HttpStatusCode.Ok);
            return true;
          });
        if (successPublish) {
          return request(app.getHttpServer())
            .get('/cms/lyrics/v1/detail/' + utilsHelper.generateSlug(slug))
            .set(token.auth, token.token)
            .then((res) => {
              expect(res.body.response_data.slug).toEqual(
                utilsHelper.generateSlug(slug),
              );
              expect(res.body.response_data.status_enum).toEqual(
                StatusEnum.REJECT,
              );
            });
        }
      }
    }
  });
  it('should create and need revision', async function () {
    const data: ICreateLyricsDto = {
      youtube_url: getRandomYoutubeUrl(),
      title: `TEST-REVISION - ${faker.person.firstName()} - ${new Date().getTime()}`,
      image: getRandomImageUrlTest(),
      categories_id: getRandomCategoriesTesting(),
      notes: faker.lorem.text(),
      artist_slug: getRandomArtistTest(),
      description: faker.lorem.text(),
      lyric: faker.lorem.lines(10),
    };
    const resCreate = await request(app.getHttpServer())
      .post('/cms/lyrics/v1/new')
      .send(data)
      .set(token.auth, token.token)
      .then((res) => {
        expect(res.status).toEqual(HttpStatusCode.Ok);
        return true;
      });
    if (resCreate) {
      const slug = utilsHelper.generateSlug(data.title);
      const getDetail = await request(app.getHttpServer())
        .get('/cms/lyrics/v1/detail/' + slug)
        .set(token.auth, token.token)
        .then((res) => {
          expect(res.status).toEqual(HttpStatusCode.Ok);
          expect(res.body.response_data.slug).toEqual(slug);
          expect(res.body.response_data.status_enum).toEqual(
            StatusEnum.PENDING,
          );
          const data: IDetailLyricResponse = res.body.response_data;
          return data;
        });
      if (getDetail) {
        const dataRejectRevision: IReqRejectRevisionLyric = {
          reason: faker.lorem.word(),
        };
        const successPublish = await request(app.getHttpServer())
          .put('/cms/lyrics/v1/need-revision/' + getDetail.slug)
          .send(dataRejectRevision)
          .set(token.auth, token.token)
          .then((res) => {
            expect(res.status).toEqual(HttpStatusCode.Ok);
            return true;
          });
        if (successPublish) {
          return request(app.getHttpServer())
            .get('/cms/lyrics/v1/detail/' + utilsHelper.generateSlug(slug))
            .set(token.auth, token.token)
            .then((res) => {
              expect(res.body.response_data.slug).toEqual(
                utilsHelper.generateSlug(slug),
              );
              expect(res.body.response_data.status_enum).toEqual(
                StatusEnum.NEED_REVISION,
              );
            });
        }
      }
    }
  });
  it('should create and need pending', async function () {
    const data: ICreateLyricsDto = {
      title: `TEST-PENDING - ${faker.person.firstName()} - ${new Date().getTime()}`,
      image: getRandomImageUrlTest(),
      categories_id: getRandomCategoriesTesting(),
      youtube_url: getRandomYoutubeUrl(),
      notes: faker.lorem.text(),
      artist_slug: getRandomArtistTest(),
      description: faker.lorem.text(),
      lyric: faker.lorem.lines(10),
    };
    const resCreate = await request(app.getHttpServer())
      .post('/cms/lyrics/v1/new')
      .send(data)
      .set(token.auth, token.token)
      .then((res) => {
        expect(res.status).toEqual(HttpStatusCode.Ok);
        return true;
      });
    if (resCreate) {
      const slug = utilsHelper.generateSlug(data.title);
      return request(app.getHttpServer())
        .get('/cms/lyrics/v1/detail/' + slug)
        .set(token.auth, token.token)
        .then((res) => {
          expect(res.status).toEqual(HttpStatusCode.Ok);
          expect(res.body.response_data.slug).toEqual(slug);
          expect(res.body.response_data.status_enum).toEqual(
            StatusEnum.PENDING,
          );
          const data: IDetailLyricResponse = res.body.response_data;
          return data;
        });
    }
  });
});
