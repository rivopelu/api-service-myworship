import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { CmsAuthController } from '@apps/cms/cms-auth/cms-auth.controller';
import { DbConfig } from '@config/db-config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@entities/User';
import { JwtModule } from '@nestjs/jwt';
import { ENV } from '@constants/ENV';
import { CmsAuthService } from '@apps/cms/cms-auth/cms-auth.service';
import { Artist } from '@entities/Artist';
import { CmsArtisService } from '@apps/cms/cms-artis/cms-artis.service';
import { CmsArtisController } from '@apps/cms/cms-artis/cms-artis.controller';
import { Categories } from '@entities/Categories';
import { CmsCategoriesController } from '@apps/cms/cms-categories/cms-categories.controller';
import { CmsCategoriesService } from '@apps/cms/cms-categories/cms-categories.service';
import { Lyrics } from '@entities/Lyrics';
import { CmsLyricsController } from '@apps/cms/cms-lyrics/cms-lyrics.controller';
import { CmsLyricsService } from '@apps/cms/cms-lyrics/cms-lyrics.service';
import { GeneralService } from '@apps/general/general.service';
import { GeneralController } from '@apps/general/general.controller';
import { S3Service } from './services/s3.service';
import { Media } from '@entities/Media';

@Module({
  imports: [
    DbConfig,
    TypeOrmModule.forFeature([User, Artist, Categories, Lyrics, Media]),
    JwtModule.register({
      secret: ENV.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [
    AppController,
    CmsAuthController,
    CmsArtisController,
    CmsCategoriesController,
    CmsLyricsController,
    GeneralController,
  ],
  providers: [
    CmsAuthService,
    CmsArtisService,
    CmsCategoriesService,
    CmsLyricsService,
    GeneralService,
    S3Service,
  ],
})
export class AppModule {}
