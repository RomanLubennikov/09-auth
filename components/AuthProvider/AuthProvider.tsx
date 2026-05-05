"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "../../lib/store/authStore";
import { checkSession } from "../../lib/api/clientApi";

interface AuthProviderProps {
  children: React.ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const [isLoading, setIsLoading] = useState(true);
  const { setUser, clearIsAuthenticated } = useAuthStore();

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const response = await checkSession();
        if (response.data) {
          setUser(response.data);
        } else {
          clearIsAuthenticated();
        }
      } catch (error) {
        // User is not authenticated, clear the state
        clearIsAuthenticated();
      } finally {
        setIsLoading(false);
      }
    };

    verifyAuth();
  }, [setUser, clearIsAuthenticated]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
}
