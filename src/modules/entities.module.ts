import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/User';
import { Artist } from '../entities/Artist';
import { Categories } from '../entities/Categories';
import { Lyrics } from '../entities/Lyrics';
import { Media } from '../entities/Media';
import { Comment } from '../entities/Comment';
import { SubComment } from '../entities/SubComment';
import { LyricsLikes } from '../entities/LyricsLikes';

export const EntitiesModule = TypeOrmModule.forFeature([
  User,
  Artist,
  Categories,
  Lyrics,
  Media,
  Comment,
  SubComment,
  LyricsLikes,
]);
