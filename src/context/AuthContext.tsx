// src/context/AuthContext.tsx

import { useNavigate } from "react-router-dom";
import { createContext, useContext, useEffect, useState } from "react";
import { getCurrentUser } from "@/lib/appwrite/api";

// Define and export the IUser type so it can be imported from this module.
export interface IUser {
  // Appwrite document properties
  $id: string;
  $collectionId: string;
  $databaseId: string;
  $createdAt: string;
  $updatedAt: string;
  $permissions: any[];

  // Custom user properties
  id: string;
  name: string;
  username: string;
  email: string;
  imageUrl: string;
  bio: string;
}

// Update INITIAL_USER to include all required fields from IUser.
export const INITIAL_USER: IUser = {
  $id: "",
  $collectionId: "",
  $databaseId: "",
  $createdAt: "",
  $updatedAt: "",
  $permissions: [],
  id: "",
  name: "",
  username: "",
  email: "",
  imageUrl: "",
  bio: "",
};

const INITIAL_STATE = {
  user: INITIAL_USER,
  isLoading: false,
  isAuthenticated: false,
  setUser: () => {},
  setIsAuthenticated: () => {},
  checkAuthUser: async () => false as boolean,
};

type IContextType = {
  user: IUser;
  isLoading: boolean;
  setUser: React.Dispatch<React.SetStateAction<IUser>>;
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  checkAuthUser: () => Promise<boolean>;
};

const AuthContext = createContext<IContextType>(INITIAL_STATE);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const [user, setUser] = useState<IUser>(INITIAL_USER);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const checkAuthUser = async () => {
    setIsLoading(true);
    try {
      const currentAccount = await getCurrentUser();
      if (currentAccount) {
        setUser({
          $id: currentAccount.$id,
          $collectionId: currentAccount.$collectionId,
          $databaseId: currentAccount.$databaseId,
          $createdAt: currentAccount.$createdAt,
          $updatedAt: currentAccount.$updatedAt,
          $permissions: currentAccount.$permissions,
          // For convenience, you can set id to be the same as $id.
          id: currentAccount.$id,
          name: currentAccount.name,
          username: currentAccount.username,
          email: currentAccount.email,
          imageUrl: currentAccount.imageUrl,
          bio: currentAccount.bio,
        });
        setIsAuthenticated(true);
        return true;
      }
      return false;
    } catch (error) {
      console.error(error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const cookieFallback = localStorage.getItem("cookieFallback");
    if (
      cookieFallback === "[]" ||
      cookieFallback === null ||
      cookieFallback === undefined
    ) {
      navigate("/sign-in");
    }
    checkAuthUser();
  }, [navigate]);

  const value = {
    user,
    setUser,
    isLoading,
    isAuthenticated,
    setIsAuthenticated,
    checkAuthUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useUserContext = () => useContext(AuthContext);
