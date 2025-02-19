

export type INavLink = {
  imgURL: string;
  route: string;
  label: string;
  mediaType?: 'image'|'video'
};

export type IUpdateUser = {
  userId: string;
  name: string;
  bio: string;
  file: File[]; // New file(s) attached for update (could be image or video)
  imageUrl: string; // URL of current user image or video
  imageId: string; // ID of the current user media file
  mediaType?: 'image' | 'video'; 
}



export type IUser = {
  id: string;
  name: string;
  username: string;
  email: string;
  imageUrl: string;
  bio: string;
};

export type INewUser = {
  name: string;
  email: string;
  username: string;
  password: string;
};


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
  file: File[]; // Array of file(s) attached for update (could be image or video)
  imageUrl: string; // URL of current post media (could be image or video)
  imageId: string; // ID of the current media file
  mediaType: "video" | "image" | "other" | "none";// Type of the media (optional)
}
import { Models } from "appwrite";
 interface Creator {
   $id: string;
  name: string;
  imageUrl?: string;
}
 export interface Post extends Models.Document {
  mediaType?: "image" | "video" | "other" | "none";
   imageUrl?: string;
  creator: Creator;
  caption: string;
  tags: string[];
  location: string;
}