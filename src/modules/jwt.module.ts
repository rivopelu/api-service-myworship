import { JwtModule } from '@nestjs/jwt';
import { ENV } from '../constants/ENV';

export const RootJwtModules = JwtModule.register({
  secret: ENV.JWT_SECRET,
  signOptions: { expiresIn: '1d' },
});
