"use client";

import AppLoader from "@/components/global/AppLoader";
import { IUser } from "@/interfaces/user";
import { getMe } from "@/services/auth.services";
import { createContext, useContext, useEffect, useState } from "react";


interface IUserContext {
  user: IUser | null,
  isLoading:boolean
}
export const UserContext = createContext<IUserContext | undefined>(undefined);

export default function UserContextWrapper({ children }: { children: React.ReactNode }) {
  const [userPayload, setUserPayload] = useState<{ user: any; isLoading: boolean }>({
    user: null,
    isLoading: true,
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getMe()
        setUserPayload({ user: res?.data || null, isLoading: false });
        console.log(res?.data);
        
      } catch (err) {
        console.error(err);
        setUserPayload({ user: null, isLoading: false });
      }
    };

    fetchUser();
  }, []);

  // Loading overlay
  if (userPayload.isLoading) {
    return <AppLoader/>
  }

  return <UserContext.Provider value={userPayload}>{children}</UserContext.Provider>;
}

export const useUser = () => { const context = useContext(UserContext); if (context === undefined) { throw new Error('useUser must be used within a UserContextProvider'); } return context; };