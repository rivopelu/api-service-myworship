import { Test, TestingModule } from '@nestjs/testing';
import { WebLyricsController } from './web-lyrics.controller';

describe('WebLyricsController', () => {
  let controller: WebLyricsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WebLyricsController],
    }).compile();

    controller = module.get<WebLyricsController>(WebLyricsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
