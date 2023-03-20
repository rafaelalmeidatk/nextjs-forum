export interface Messages {
  id: string;
  content: string;
  createdAt: Date;
  editedAt: Date | null;
  userId: string;
  postId: string;
}

export interface Posts {
  id: string;
  title: string;
  isLocked: number;
  createdAt: Date;
  editedAt: Date | null;
  userId: string | null;
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
