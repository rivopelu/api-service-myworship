import { LyricsRepository } from '../repositories/lyrics.repository';
import { ArtistRepository } from '../repositories/artist.repository';
import { CommentRepository } from '../repositories/comment.repository';
import { SubCommentRepository } from '../repositories/sub-comment.repository';
import { UserRepository } from '../repositories/user.repository';
import { LyricsLikesRepository } from '../repositories/lyrics-likes.repository';

export const RepositoriesModule = [
  LyricsRepository,
  ArtistRepository,
  CommentRepository,
  SubCommentRepository,
  UserRepository,
  LyricsLikesRepository,
];
