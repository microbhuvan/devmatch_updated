export interface SearchUser {
  _id: string;

  userId: {
    _id: string;
    username: string;
    email: string;
  };

  about: string;
  skills: string[];
  photoURL: string | null;
  github: string;
  linkedin: string;
}
