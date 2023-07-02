export interface IResCommentLyrics {
  comment_by_username: string;
  comment_by_image: string;
  comment: string;
  sub_comment: IResSubCommentLyrics[];
  created_at: Date;
  id: number;
}

export interface IResSubCommentLyrics {
  comment_by_username: string;
  comment: string;
  comment_by_image: string;
  created_at: Date;
}
