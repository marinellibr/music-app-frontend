import { Post } from "./user.model";

export interface Media extends Post {
  mediaName: string;
  mediaArtist: string;
  mediaCoverUrl: string;
  mediaYear: string;
  mediaLink: string;
}
