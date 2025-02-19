import { Client, Account, Databases, Storage, Avatars } from "appwrite";

// Provide fallback values if environment variables are not set
export const appwriteConfig = {
  url: import.meta.env.VITE_APPWRITE_URL || "https://cloud.appwrite.io/v1",
  projectId: import.meta.env.VITE_APPWRITE_PROJECT_ID || "YOUR_PROJECT_ID",
  databaseId: import.meta.env.VITE_APPWRITE_DATABASE_ID || "YOUR_DATABASE_ID",
  storageId: import.meta.env.VITE_APPWRITE_STORAGE_ID || "YOUR_STORAGE_ID",
  userCollectionId: import.meta.env.VITE_APPWRITE_USER_COLLECTION_ID || "YOUR_USER_COLLECTION_ID",
  postCollectionId: import.meta.env.VITE_APPWRITE_POST_COLLECTION_ID || "YOUR_POST_COLLECTION_ID",
  savesCollectionId: import.meta.env.VITE_APPWRITE_SAVES_COLLECTION_ID || "YOUR_SAVES_COLLECTION_ID",
};

// Debug: log the endpoint to ensure it's defined
if (!appwriteConfig.url) {
  console.error("Appwrite endpoint is not defined. Please set VITE_APPWRITE_URL in your .env file.");
}

export const client = new Client();
client.setEndpoint(appwriteConfig.url);
client.setProject(appwriteConfig.projectId);

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export const avatars = new Avatars(client);
