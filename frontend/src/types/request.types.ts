export interface Profile {
  photoURL?: string;
  about?: string;
  skills?: string[];
}

export interface RequestUser {
  _id: string;
  username: string;
  email: string;
  profile?: Profile;
}

export interface Connection {
  _id: string;
  fromUserId: RequestUser;
  toUserId: RequestUser;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReceivedRequest {
  _id: string;
  fromUserId: RequestUser;
  toUserId: RequestUser;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface SentRequest {
  _id: string;
  fromUserId: RequestUser;
  toUserId: RequestUser;
  status: string;
  createdAt: string;
  updatedAt: string;
}
