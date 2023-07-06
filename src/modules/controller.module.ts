import { AppController } from '../app.controller';
import { CmsAuthController } from '../controllers/cms-auth.controller';
import { CmsArtisController } from '../controllers/cms-artis.controller';
import { CmsCategoriesController } from '../controllers/cms-categories.controller';
import { CmsLyricsController } from '../controllers/cms-lyrics.controller';
import { GeneralController } from '../controllers/general.controller';
import { CmsUserController } from '../controllers/cms-user.controller';
import { WebAuthController } from '../controllers/web-auth.controller';
import { WebLyricsController } from '../controllers/web-lyrics.controller';
import { WebArtistController } from '../controllers/web-artist.controller';
import { WebLayoutsController } from '../controllers/web-layouts.controller';
import { WebUserController } from '../controllers/web-user.controller';

export const ControllerModule = [
  AppController,
  CmsAuthController,
  CmsArtisController,
  CmsCategoriesController,
  CmsLyricsController,
  GeneralController,
  CmsUserController,
  WebAuthController,
  WebLyricsController,
  WebArtistController,
  WebLayoutsController,
  WebUserController,
];
