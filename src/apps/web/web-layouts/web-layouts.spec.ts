import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../../../app.module';
import * as request from 'supertest';
import { HttpStatusCode } from 'axios';
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
  it('GET WEB LAYOUTS', function () {
    return request(app.getHttpServer())
      .get('/web/layouts/v1/home-content')
      .then((res) => {
        expect(res.status).toEqual(HttpStatusCode.Ok);
      });
  });
});
