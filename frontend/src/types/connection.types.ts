export interface ConnectionUser {
  _id: string;
  username: string;
  email: string;
}

export interface Connection {
  _id: string;
  fromUserId: ConnectionUser;
  toUserId: ConnectionUser;
  status: string;
}
