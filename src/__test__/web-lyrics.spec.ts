import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { HttpStatusCode } from 'axios';
import { IReqCommentLyrics } from '../dto/request/lyrics-request/IReqCommentLyrics';
import { faker } from '@faker-js/faker';
import {
  getRandomArtistTest,
  getRandomCommentId,
  getRandomLyricsSlugTest,
  ISetToken,
  loginCmsTest,
  setTokenTest,
} from '../utils/testing-utils';
import { IReqAddSubLyricComment } from '../dto/request/lyrics-request/IReqAddSubLyricComment';
import { AppModule } from '../app.module';

describe('WEB LYRIC TEST', () => {
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
  it('should get search lyric', function () {
    return request(app.getHttpServer())
      .get('/web/lyrics/v1/search-lyric?search=l')
      .then((res) => {
        expect(res.status).toEqual(HttpStatusCode.Ok);
      });
  });
  it('should get detail lyric by slug', function () {
    const slug = getRandomLyricsSlugTest();
    return request(app.getHttpServer())
      .get(`/web/lyrics/v1/detail/${slug}`)
      .then((res) => {
        expect(res.status).toEqual(HttpStatusCode.Ok);
      });
  });
  describe('Get Pagination ', () => {
    it('should Get Pagination data by artist slug', function () {
      const artistSlug = getRandomArtistTest();
      return request(app.getHttpServer())
        .get(`/web/lyrics/v1/list/artist/${artistSlug}`)
        .then((res) => {
          expect(res.status).toEqual(HttpStatusCode.Ok);
          expect(res.body.pagination_data.page).toEqual(0);
        });
    });
    it('should Get Pagination data by artist slug', function () {
      const artistSlug = getRandomArtistTest();
      return request(app.getHttpServer())
        .get(`/web/lyrics/v1/list/artist/${artistSlug}?size=2`)
        .then((res) => {
          expect(res.status).toEqual(HttpStatusCode.Ok);
          expect(res.body.response_data.length).toEqual(2);
        });
    });

    describe('POST COMMENT LYRICS', function () {
      it('should post comment', async function () {
        const mockData: IReqCommentLyrics = {
          comment: faker.lorem.paragraphs(2),
          lyrics_slug: getRandomLyricsSlugTest(),
        };
        return request(app.getHttpServer())
          .post('/web/lyrics/v1/add-comment')
          .send(mockData)
          .set(token.auth, token.token)
          .then((res) => {
            expect(res.status).toEqual(HttpStatusCode.Ok);
          });
      });
      it('should post sub comment', async function () {
        const mockData: IReqAddSubLyricComment = {
          comment: faker.lorem.paragraphs(2),
          parent_id: getRandomCommentId(),
        };
        return request(app.getHttpServer())
          .post('/web/lyrics/v1/add-comment')
          .send(mockData)
          .set(token.auth, token.token)
          .then((res) => {
            expect(res.status).toEqual(HttpStatusCode.Ok);
          });
      });
    });
  });
});
