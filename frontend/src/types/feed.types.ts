export interface FeedUser {
  _id: string;
  username: string;
  profile: {
    photoURL?: string;
    about?: string;
    skills: string[];
    github?: string;
    linkedin?: string;
  };
}
