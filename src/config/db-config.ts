import { TypeOrmModule } from '@nestjs/typeorm';
import { ENV } from '@constants/ENV';

export const DbConfig = TypeOrmModule.forRoot({
  type: 'mysql',
  host: ENV.DB.HOST,
  port: ENV.DB.PORT,
  username: ENV.DB.USER,
  password: ENV.DB.PW,
  database: ENV.DB.NAME,
  entities: [],
  synchronize: false,
  dropSchema: false,
  logging: true,
  autoLoadEntities: true,
});
