export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
}

export interface Note {
  id: string;
  title: string;
  description: string;
  createdAt: number;
  userId: string;
}
