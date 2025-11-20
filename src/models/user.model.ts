export interface User {
  _id: string;
  username: string;
  name: string;
  email: string;
  profilePictureUrl: string;
  bio: string;
  createdAt: string;
  followingCount: number;
  followersCount: number;
  posts: Post[];
}

export interface Post {
  content: string;
  mediaType: "track" | "album";
  mediaId: string;
  createdAt: string;
  rating: number;
  liked: boolean;
}
