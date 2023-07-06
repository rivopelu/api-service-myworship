import { CmsAuthService } from '../services/cms-auth.service';
import { CmsArtisService } from '../services/cms-artis.service';
import { CmsCategoriesService } from '../services/cms-categories.service';
import { CmsLyricsService } from '../services/cms-lyrics.service';
import { GeneralService } from '../services/general.service';
import { S3Service } from '../services/s3.service';
import { CmsUserService } from '../services/cms-user.service';
import { WebAuthService } from '../services/web-auth.service';
import { WebLyricsService } from '../services/web-lyrics.service';
import { WebArtistService } from '../services/web-artist.service';
import { WebLayoutsService } from '../services/web-layouts.service';
import { WebUserService } from '../services/web-user.service';

export const ServicesModule = [
  CmsAuthService,
  CmsArtisService,
  CmsCategoriesService,
  CmsLyricsService,
  GeneralService,
  S3Service,
  CmsUserService,
  WebAuthService,
  WebLyricsService,
  WebArtistService,
  WebLayoutsService,
  WebUserService,
];
