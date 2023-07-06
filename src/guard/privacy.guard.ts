import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { ENV } from '../constants/ENV';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/User';
import { Repository } from 'typeorm';

@Injectable()
export class PrivacyGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      request['user'] = await this.jwtService.verifyAsync(token, {
        secret: ENV.JWT_SECRET,
      });
      if (request['user']) {
        const parseTokenUser = request['user'];
        const getUser = await this.userRepository.findOne({
          where: { id: parseTokenUser.id },
        });
        if (getUser) {
          return request['user'];
        }
      }
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
