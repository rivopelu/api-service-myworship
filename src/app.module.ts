import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { DbConfig } from './config/db-config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ENV } from './constants/ENV';
import { CmsAuthController } from './apps/cms/cms-auth/cms-auth.controller';
import { CmsArtisController } from './apps/cms/cms-artis/cms-artis.controller';
import { CmsCategoriesController } from './apps/cms/cms-categories/cms-categories.controller';
import { CmsLyricsController } from './apps/cms/cms-lyrics/cms-lyrics.controller';
import { GeneralController } from './apps/general/general.controller';
import { CmsUserController } from './apps/cms/cms-user/cms-user.controller';
import { WebAuthController } from './apps/web/web-auth/web-auth.controller';
import { CmsAuthService } from './apps/cms/cms-auth/cms-auth.service';
import { CmsArtisService } from './apps/cms/cms-artis/cms-artis.service';
import { CmsCategoriesService } from './apps/cms/cms-categories/cms-categories.service';
import { CmsLyricsService } from './apps/cms/cms-lyrics/cms-lyrics.service';
import { GeneralService } from './apps/general/general.service';
import { S3Service } from './services/s3.service';
import { CmsUserService } from './apps/cms/cms-user/cms-user.service';
import { WebAuthService } from './apps/web/web-auth/web-auth.service';
import { User } from './entities/User';
import { Artist } from './entities/Artist';
import { Categories } from './entities/Categories';
import { Lyrics } from './entities/Lyrics';
import { Media } from './entities/Media';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { DefaultPostInterceptor } from './config/DefaultPostInterceptor';

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
    CmsUserController,
    WebAuthController,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: DefaultPostInterceptor,
    },
    CmsAuthService,
    CmsArtisService,
    CmsCategoriesService,
    CmsLyricsService,
    GeneralService,
    S3Service,
    CmsUserService,
    WebAuthService,
  ],
})
export class AppModule {}
