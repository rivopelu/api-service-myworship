import { Logger, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { DbConfig } from './config/db-config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { DefaultPostInterceptor } from './config/DefaultPostInterceptor';
import { MailModule } from './mail/mail.module';
import { RootJwtModules } from './modules/jwt.module';
import { ControllerModule } from './modules/controller.module';
import { ServicesModule } from './modules/services.module';
import { RepositoriesModule } from './modules/repositories.module';
import { EntitiesModule } from './modules/entities.module';
import { LoggerMiddleware } from './config/logger-middleware.service';

@Module({
  imports: [DbConfig, RootJwtModules, EntitiesModule, MailModule],
  controllers: [...ControllerModule],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: DefaultPostInterceptor,
    },
    ...RepositoriesModule,
    ...ServicesModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
