import { ObjectId } from 'mongodb';
export interface User {
  _id?: ObjectId;
  username: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserResponse {
  _id: string;
  username: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}
