import { Test, TestingModule } from '@nestjs/testing';
import { WebLyricsService } from './web-lyrics.service';

describe('WebLyricsService', () => {
  let service: WebLyricsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WebLyricsService],
    }).compile();

    service = module.get<WebLyricsService>(WebLyricsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
