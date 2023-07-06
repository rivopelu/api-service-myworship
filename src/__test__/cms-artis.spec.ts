import { INestApplication } from '@nestjs/common';
import {
  getRandomImageUrlTest,
  ISetToken,
  loginCmsTest,
  setTokenTest,
} from '../utils/testing-utils';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../app.module';
import { ICreatedArtistDto } from '../dto/request/artis-request/ICreatedArtistDto';
import { faker } from '@faker-js/faker';
import * as request from 'supertest';
import { HttpStatusCode } from 'axios';
import { UtilsHelper } from '../helper/utils-helper';

describe('CMS ARTIST TESTING', () => {
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

  it('Create Artist Pending', async function () {
    const dataBody: ICreatedArtistDto = {
      name: `TEST-PENDING - ${faker.person.firstName()} - ${new Date().getTime()}`,
      image: getRandomImageUrlTest(),
      notes: faker.lorem.lines(20),
      description: faker.lorem.lines(20),
    };
    const resCreate = await request(app.getHttpServer())
      .post('/cms/artist/v1/new')
      .send(dataBody)
      .set(token.auth, token.token)
      .then((res) => {
        expect(res.status).toEqual(HttpStatusCode.Ok);
        return true;
      });

    if (resCreate) {
      const slug = utilsHelper.generateSlug(dataBody.name);
      return request(app.getHttpServer())
        .get('/cms/artist/v1/detail/' + slug)
        .set(token.auth, token.token)
        .then((res) => {
          expect(res.status).toEqual(HttpStatusCode.Ok);
          expect(res.body.response_data.slug).toEqual(slug);
        });
    }
  });
});
