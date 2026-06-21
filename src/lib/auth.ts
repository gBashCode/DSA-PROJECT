"use client";

import { useEffect, useState, useCallback, useRef } from "react";
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

export function useAuth() {
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
        // Profile row is created by a database trigger (handle_new_user)
        // using the metadata passed in options.data above.
        // Wait briefly for the trigger, then fetch the profile.
        await new Promise((r) => setTimeout(r, 500));

        const { data: profileData } = await getSupabase()
          .from("profiles")
          .select("*")
          .eq("id", data.user.id)
          .single();

        if (profileData) {
          setProfile(profileData);
        }
      }

      return { ok: true };
    },
    [getSupabase]
  );

  const login = useCallback(
    async (
      email: string,
      password: string
    ): Promise<{ ok: boolean; error?: string }> => {
      const { error } = await getSupabase().auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { ok: false, error: error.message };
      }

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

      const { error } = await getSupabase()
        .from("profiles")
        .update(updates)
        .eq("id", user.id);

      if (!error && profile) {
        setProfile({ ...profile, ...updates });
      }
    },
    [user, profile, getSupabase]
  );

  const changePassword = useCallback(
    async (
      currentPassword: string,
      newPassword: string
    ): Promise<{ ok: boolean; error?: string }> => {
      if (!user?.email) return { ok: false, error: "Not logged in." };

      const { error: signInError } = await getSupabase().auth.signInWithPassword({
        email: user.email,
        password: currentPassword,
      });

      if (signInError) {
        return { ok: false, error: "Current password is incorrect." };
      }

      const { error } = await getSupabase().auth.updateUser({
        password: newPassword,
      });

      if (error) {
        return { ok: false, error: error.message };
      }

      return { ok: true };
    },
    [user, getSupabase]
  );

  const findUserByUsername = useCallback(
    async (username: string): Promise<Profile | null> => {
      const { data } = await getSupabase()
        .from("profiles")
        .select("*")
        .eq("username", username.toLowerCase())
        .single();

      return data;
    },
    [getSupabase]
  );

  const getUserById = useCallback(
    async (id: string): Promise<Profile | null> => {
      const { data } = await getSupabase()
        .from("profiles")
        .select("*")
        .eq("id", id)
        .single();

      return data;
    },
    [getSupabase]
  );

  const signInWithMagicLink = useCallback(
    async (
      email: string
    ): Promise<{ error?: string }> => {
      const { error } = await getSupabase().auth.signInWithOtp({
        email,
      });

      if (error) {
        return { error: error.message };
      }

      return {};
    },
    [getSupabase]
  );

  return {
    user,
    profile,
    loading,
    signup,
    login,
    logout,
    updateProfile,
    changePassword,
    signInWithMagicLink,
    findUserByUsername,
    getUserById,
  };
}
