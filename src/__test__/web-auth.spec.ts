import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../app.module';
import * as request from 'supertest';
import { HttpStatusCode } from 'axios';
import { faker } from '@faker-js/faker';
import { UtilsHelper } from '../helper/utils-helper';
import { SuperAdminGuard } from '../guard/super-admin.guard';
import IRegisterDto from '../dto/request/auth-request/IRegisterDto';
import { AdminGuard } from '../guard/admin.guard';
import ILoginDto from '../dto/request/auth-request/ILoginDto';

describe('testing utilities Testing', () => {
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
  describe(' AUTH TESTING', () => {
    it('REGISTER SUCCESS', async function () {
      const dataTest: IRegisterDto = {
        name: 'UNIT TEST GENERATE - ' + new Date().getTime(),
        email: new Date().getTime().toString() + faker.internet.email(),
        username: faker.person.firstName() + utilsHelper.getThisTime(),
        password: faker.string.uuid(),
      };
      return request(app.getHttpServer())
        .post('/web/auth/v1/register')
        .send(dataTest)
        .then((res) => {
          expect(res.status).toEqual(HttpStatusCode.Ok);
        });
    });
    it('LOGIN SUCCESS', async function () {
      const dataTestLogin: ILoginDto = {
        password: 'user',
        email: 'user@gmail.com',
      };
      return request(app.getHttpServer())
        .post('/web/auth/v1/login')
        .send(dataTestLogin)
        .then((res) => {
          expect(res.status).toEqual(HttpStatusCode.Ok);
        });
    });
  });
});
