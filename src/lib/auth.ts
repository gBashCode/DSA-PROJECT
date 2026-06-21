"use client";

import { createContext, useContext, useEffect, useState, useCallback, useRef, ReactNode } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

export interface Profile {
  id: string;
  username: string;
  display_name: string;
  avatar: string;
  bio: string;
  created_at: string;
}

export const AVATARS = [
  "🧑‍💻", "👩‍💻", "🦊", "🐺", "🦁", "🐯", "🐲", "🦄",
  "🦅", "🐙", "🦑", "🦈", "🤖", "👾", "🎮", "⚡",
  "🔥", "💎", "🎯", "🧠",
];

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signup: (email: string, password: string, username: string, displayName: string, avatar: string, bio: string) => Promise<{ ok: boolean; error?: string }>;
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<Pick<Profile, "display_name" | "avatar" | "bio">>) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<{ ok: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  signup: async () => ({ ok: false }),
  login: async () => ({ ok: false }),
  logout: async () => {},
  updateProfile: async () => {},
  changePassword: async () => ({ ok: false }),
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const supabaseRef = useRef<ReturnType<typeof createClient> | null>(null);

  const getSupabase = useCallback(() => {
    if (!supabaseRef.current) {
      supabaseRef.current = createClient();
    }
    return supabaseRef.current;
  }, []);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await getSupabase().auth.getUser();
      setUser(user);

      if (user) {
        const { data } = await getSupabase()
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();
        setProfile(data);
      }

      setLoading(false);
    };

    getUser();

    const { data: { subscription } } = getSupabase().auth.onAuthStateChange(
      async (_event, session) => {
        setUser(session?.user ?? null);

        if (session?.user) {
          const { data } = await getSupabase()
            .from("profiles")
            .select("*")
            .eq("id", session.user.id)
            .single();
          setProfile(data);
        } else {
          setProfile(null);
        }

        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, [getSupabase]);

  const signup = useCallback(
    async (
      email: string,
      password: string,
      username: string,
      displayName: string,
      avatar: string,
      bio: string
    ): Promise<{ ok: boolean; error?: string }> => {
      const { data: existing } = await getSupabase()
        .from("profiles")
        .select("id")
        .eq("username", username.toLowerCase())
        .single();

      if (existing) {
        return { ok: false, error: "Username already taken." };
      }

      const { data, error } = await getSupabase().auth.signUp({
        email,
        password,
        options: {
          data: {
            username: username.toLowerCase(),
            display_name: displayName,
            avatar,
            bio,
          },
        },
      });

      if (error) {
        return { ok: false, error: error.message };
      }

      if (data.user) {
        await new Promise((r) => setTimeout(r, 500));
        const { data: profileData } = await getSupabase()
          .from("profiles")
          .select("*")
          .eq("id", data.user.id)
          .single();
        if (profileData) setProfile(profileData);
      }

      return { ok: true };
    },
    [getSupabase]
  );

  const login = useCallback(
    async (email: string, password: string): Promise<{ ok: boolean; error?: string }> => {
      const { error } = await getSupabase().auth.signInWithPassword({ email, password });
      if (error) return { ok: false, error: error.message };
      return { ok: true };
    },
    [getSupabase]
  );

  const logout = useCallback(async () => {
    await getSupabase().auth.signOut();
  }, [getSupabase]);

  const updateProfile = useCallback(
    async (updates: Partial<Pick<Profile, "display_name" | "avatar" | "bio">>) => {
      if (!user) return;
      const { error } = await getSupabase().from("profiles").update(updates).eq("id", user.id);
      if (!error && profile) setProfile({ ...profile, ...updates });
    },
    [user, profile, getSupabase]
  );

  const changePassword = useCallback(
    async (currentPassword: string, newPassword: string): Promise<{ ok: boolean; error?: string }> => {
      if (!user?.email) return { ok: false, error: "Not logged in." };
      const { error: signInError } = await getSupabase().auth.signInWithPassword({
        email: user.email,
        password: currentPassword,
      });
      if (signInError) return { ok: false, error: "Current password is incorrect." };
      const { error } = await getSupabase().auth.updateUser({ password: newPassword });
      if (error) return { ok: false, error: error.message };
      return { ok: true };
    },
    [user, getSupabase]
  );

  return (
    <AuthContext.Provider value={{ user, profile, loading, signup, login, logout, updateProfile, changePassword }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
