"use client";
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

export type LoggedInUser = {
  id: string;
  name: string;
  role: string;
  location: string;
  district: string;
  state: string;
  rating: number;
  jobsCompleted: number;
  isAadhaarVerified: boolean;
  aadhaarLast4: string;
  skills: string[];
  languages: string[];
  phone: string;
  createdAt: string;
  // Real fields fetched from Aadhaar via Sandbox KYC
  dob?: string;           // e.g. "1990-05-14"
  gender?: string;        // "M" | "F" | "T"
  careOf?: string;        // e.g. "S/O Suresh Kumar"
  photo?: string;         // base64 encoded profile photo
  address?: {
    house?: string;
    street?: string;
    locality?: string;
    city?: string;
    district?: string;
    state?: string;
    pincode?: string;
    country?: string;
  };
};

type UserContextType = {
  user: LoggedInUser | null;
  login: (user: LoggedInUser) => void;
  logout: () => void;
};

const UserContext = createContext<UserContextType>({
  user: null,
  login: () => {},
  logout: () => {},
});

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<LoggedInUser | null>(null);

  // On mount, try to hydrate from cookie
  useEffect(() => {
    try {
      const match = document.cookie.match(/coral_user=([^;]+)/);
      if (match && match[1]) {
        const decoded = decodeURIComponent(match[1]);
        const parsed = JSON.parse(decoded);
        setUser(parsed);
      }
    } catch (e) {
      console.warn("Failed to parse coral_user cookie", e);
    }
  }, []);

  const login = useCallback((userData: LoggedInUser) => {
    setUser(userData);
    // Also persist to cookie (7 days)
    const encoded = encodeURIComponent(JSON.stringify(userData));
    document.cookie = `coral_user=${encoded}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    document.cookie = "coral_user=; path=/; max-age=0";
  }, []);

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
