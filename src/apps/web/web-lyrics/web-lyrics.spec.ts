import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../../../app.module';
import * as request from 'supertest';
import { HttpStatusCode } from 'axios';
import { UtilsHelper } from '../../../helper/utils-helper';
import { SuperAdminGuard } from '../../../guard/super-admin.guard';
import { AdminGuard } from '../../../guard/admin.guard';

describe('WEB LYRIC TEST', () => {
  let app: INestApplication;
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideGuard(AdminGuard) // Override the AuthGuard
      .useValue({ canActivate: () => true })
      .overrideGuard(SuperAdminGuard) // Override the AuthGuard
      .useValue({ canActivate: () => true })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
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
    const slug = 'unit-test-lyrics';
    return request(app.getHttpServer())
      .get(`/web/lyrics/v1/detail/${slug}`)
      .then((res) => {
        expect(res.status).toEqual(HttpStatusCode.Ok);
        expect(res.body.response_data.slug).toEqual(slug);
      });
  });
  describe('Get Pagination ', () => {
    it('should Get Pagination data by artist slug', function () {
      const artistSlug = 'unit-test';
      return request(app.getHttpServer())
        .get(`/web/lyrics/v1/list/artist/${artistSlug}`)
        .then((res) => {
          expect(res.status).toEqual(HttpStatusCode.Ok);
          expect(res.body.pagination_data.page).toEqual(0);
        });
    });
    it('should Get Pagination data by artist slug', function () {
      const artistSlug = 'unit-test';
      return request(app.getHttpServer())
        .get(`/web/lyrics/v1/list/artist/${artistSlug}?size=2`)
        .then((res) => {
          expect(res.status).toEqual(HttpStatusCode.Ok);
          expect(res.body.response_data.length).toEqual(2);
        });
    });
  });
});
