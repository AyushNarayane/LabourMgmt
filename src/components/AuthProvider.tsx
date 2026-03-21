"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  GoogleAuthProvider,
  signInWithPopup,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

// ================================================================
// TYPES
// ================================================================
type UserRole = "worker" | "employer";

type UserProfile = {
  uid: string;
  name: string;
  email?: string;
  phone?: string;
  role: UserRole;
  state?: string;
  district?: string;
  skills?: string[];
  languages?: string[];
  businessName?: string;
  isAadhaarVerified: boolean;
  aadhaarLast4?: string;
  createdAt: unknown;
};

type AuthContextType = {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  error: string | null;
  // Email auth
  signUpWithEmail: (email: string, password: string, name: string, role: UserRole, profileData?: Partial<UserProfile>) => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  // Google auth
  signInWithGoogle: (role: UserRole) => Promise<void>;
  // Phone auth
  sendPhoneOtp: (phoneNumber: string, recaptchaContainerId: string) => Promise<ConfirmationResult | null>;
  verifyPhoneOtp: (confirmationResult: ConfirmationResult, otp: string, role: UserRole, profileData?: Partial<UserProfile>) => Promise<void>;
  // Sign out
  signOut: () => Promise<void>;
  // Helpers
  clearError: () => void;
  saveProfile: (data: Partial<UserProfile>) => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  userProfile: null,
  loading: true,
  error: null,
  signUpWithEmail: async () => {},
  signInWithEmail: async () => {},
  signInWithGoogle: async () => {},
  sendPhoneOtp: async () => null,
  verifyPhoneOtp: async () => {},
  signOut: async () => {},
  clearError: () => {},
  saveProfile: async () => {},
});

// ================================================================
// PROVIDER
// ================================================================
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Listen to auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        // Fetch profile from Firestore
        try {
          const profileDoc = await getDoc(doc(db, "users", firebaseUser.uid));
          if (profileDoc.exists()) {
            setUserProfile(profileDoc.data() as UserProfile);
          }
        } catch (err) {
          console.error("Failed to fetch profile:", err);
        }
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Helper to remove undefined fields for Firestore
  const stripUndefined = (obj: any) => 
    Object.fromEntries(Object.entries(obj).filter(([_, v]) => v !== undefined));

  // Save or update profile in Firestore
  const saveProfile = async (data: Partial<UserProfile>) => {
    if (!user) throw new Error("No user logged in");
    const profileRef = doc(db, "users", user.uid);
    const cleanData = stripUndefined({ ...data, uid: user.uid });
    await setDoc(profileRef, cleanData, { merge: true });
    // Re-fetch
    const profileDoc = await getDoc(profileRef);
    if (profileDoc.exists()) {
      setUserProfile(profileDoc.data() as UserProfile);
    }
  };

  // ========== EMAIL AUTH ==========
  const signUpWithEmail = async (
    email: string,
    password: string,
    name: string,
    role: UserRole,
    profileData?: Partial<UserProfile>
  ) => {
    try {
      setError(null);
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(cred.user, { displayName: name });

      // Save profile to Firestore
      const profile: UserProfile = stripUndefined({
        uid: cred.user.uid,
        name,
        email,
        role,
        isAadhaarVerified: false,
        createdAt: serverTimestamp(),
        ...profileData,
      }) as UserProfile;
      await setDoc(doc(db, "users", cred.user.uid), profile);
      setUserProfile(profile);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Sign up failed";
      setError(message);
      throw err;
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    try {
      setError(null);
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Sign in failed";
      setError(message);
      throw err;
    }
  };

  // ========== GOOGLE AUTH ==========
  const signInWithGoogle = async (role: UserRole) => {
    try {
      setError(null);
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const u = result.user;

      // Check if profile exists, if not create one
      const profileRef = doc(db, "users", u.uid);
      const profileDoc = await getDoc(profileRef);
      if (!profileDoc.exists()) {
        const profile: UserProfile = stripUndefined({
          uid: u.uid,
          name: u.displayName || "User",
          email: u.email || undefined,
          role,
          isAadhaarVerified: false,
          createdAt: serverTimestamp(),
        }) as UserProfile;
        await setDoc(profileRef, profile);
        setUserProfile(profile);
      } else {
        setUserProfile(profileDoc.data() as UserProfile);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Google sign in failed";
      setError(message);
      throw err;
    }
  };

  // ========== PHONE AUTH ==========
  const sendPhoneOtp = async (
    phoneNumber: string,
    recaptchaContainerId: string
  ): Promise<ConfirmationResult | null> => {
    try {
      setError(null);
      const recaptchaVerifier = new RecaptchaVerifier(auth, recaptchaContainerId, {
        size: "invisible",
      });
      const confirmation = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
      return confirmation;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to send OTP";
      setError(message);
      return null;
    }
  };

  const verifyPhoneOtp = async (
    confirmationResult: ConfirmationResult,
    otp: string,
    role: UserRole,
    profileData?: Partial<UserProfile>
  ) => {
    try {
      setError(null);
      const result = await confirmationResult.confirm(otp);
      const u = result.user;

      // Check if profile exists
      const profileRef = doc(db, "users", u.uid);
      const profileDoc = await getDoc(profileRef);
      if (!profileDoc.exists()) {
        const profile: UserProfile = stripUndefined({
          uid: u.uid,
          name: profileData?.name || "Worker",
          phone: u.phoneNumber || undefined,
          role,
          isAadhaarVerified: false,
          createdAt: serverTimestamp(),
          ...profileData,
        }) as UserProfile;
        await setDoc(profileRef, profile);
        setUserProfile(profile);
      } else {
        setUserProfile(profileDoc.data() as UserProfile);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "OTP verification failed";
      setError(message);
      throw err;
    }
  };

  // ========== SIGN OUT ==========
  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      setUser(null);
      setUserProfile(null);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Sign out failed";
      setError(message);
    }
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        loading,
        error,
        signUpWithEmail,
        signInWithEmail,
        signInWithGoogle,
        sendPhoneOtp,
        verifyPhoneOtp,
        signOut,
        clearError,
        saveProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
