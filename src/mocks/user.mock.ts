import { User } from "../models/user.model";

export const UserMock: User = {
  _id: "691555322217fbbfe1c7677d",
  username: "luizmarinelli",
  name: "Luiz Henrique Marinelli",
  email: "luiz.marinelli@example.com",
  profilePictureUrl: "https://randomuser.me/api/portraits/men/32.jpg",
  bio: "Apaixonado por design, música e café forte.",
  createdAt: "2025-11-13T03:00:00.000Z",
  followingCount: 210,
  followersCount: 480,
  posts: [
    {
      content: "Curtindo essa faixa demais!",
      mediaType: "track",
      mediaId: "2lTm559tuIvatlT1u0JYG2",
      createdAt: "2025-11-13T03:02:00.000Z",
      rating: 9.2,
    },
    {
      content: "Esse álbum é simplesmente incrível!",
      mediaType: "album",
      mediaId: "5ht7ItJgpBH7W6vJ5BqpPr",
      createdAt: "2025-11-13T03:10:00.000Z",
      rating: 8.7,
    },
  ],
};
