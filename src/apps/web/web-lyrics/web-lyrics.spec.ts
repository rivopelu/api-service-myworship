import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../../../app.module';
import * as request from 'supertest';
import { HttpStatusCode } from 'axios';
import { faker } from '@faker-js/faker';
import { UtilsHelper } from '../../../helper/utils-helper';
import { SuperAdminGuard } from '../../../guard/super-admin.guard';
import IRegisterDto from '../../../dto/request/auth-request/IRegisterDto';
import { AdminGuard } from '../../../guard/admin.guard';
import ILoginDto from '../../../dto/request/auth-request/ILoginDto';

describe('WEB LYRIC TEST', () => {
  let app: INestApplication;
  const utilsHelper = new UtilsHelper();
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
});
