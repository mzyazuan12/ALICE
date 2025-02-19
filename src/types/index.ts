import { Models } from "appwrite";

// Navigation link type
export type INavLink = {
  imgURL: string;
  route: string;
  label: string;
  mediaType?: 'image' | 'video';
};

// User types
export interface IUser extends Models.Document {
  name: string;
  username: string;
  email: string;
  imageUrl: string; // Must be a string
  bio: string;
  mediaType?: 'image' | 'video';
}

export type INewUser = {
  name: string;
  email: string;
  username: string;
  password: string;
};

export type IUpdateUser = {
  userId: string;
  name: string;
  bio: string;
  file: File[];
  imageUrl: string;
  imageId: string;
  mediaType?: 'image' | 'video';
};

// Post types
export interface INewPost {
  caption: string;
  file: File[];
  location: string;
  tags: string;
  userId: string;
  mediaType: "video" | "image" | "other" | "none";
}

export interface IUpdatePost {
  postId: string;
  caption: string;
  location: string;
  tags?: string;
  file: File[];
  imageUrl: string;
  imageId: string;
  mediaType: "video" | "image" | "other" | "none";
}

// Appwrite-related interfaces
interface Creator extends Models.Document {
  name: string;
  imageUrl?: string;
  mediaType?: 'image' | 'video';
}

export interface Post extends Models.Document {
  mediaType: "image" | "video" | "other" | "none";
  imageUrl: string;
  creator: Creator;
  caption: string;
  tags: string[];
  location: string;
}
