export interface Messages {
  id: string;
  content: string | null;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

export interface Posts {
  id: string;
  title: string;
  isLocked: number;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

export interface Users {
  id: string;
  username: string;
  discriminator: string;
}

export interface DB {
  messages: Messages;
  posts: Posts;
  users: Users;
}
