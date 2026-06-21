-- 1. Add guild_code to guilds table
ALTER TABLE public.guilds ADD COLUMN IF NOT EXISTS guild_code text;

-- Function to generate a unique 5-digit numeric code
CREATE OR REPLACE FUNCTION public.generate_guild_code()
RETURNS text
LANGUAGE plpgsql
AS $$
DECLARE
  code text;
  exists_count int;
BEGIN
  LOOP
    code := '#' || lpad(floor(random() * 99999 + 1)::int::text, 5, '0');
    SELECT count(*) INTO exists_count FROM public.guilds WHERE guild_code = code;
    EXIT WHEN exists_count = 0;
  END LOOP;
  RETURN code;
END;
$$;

-- Backfill existing guilds with codes
UPDATE public.guilds SET guild_code = public.generate_guild_code() WHERE guild_code IS NULL;

-- Set default and make NOT NULL
ALTER TABLE public.guilds ALTER COLUMN guild_code SET DEFAULT '';
UPDATE public.guilds SET guild_code = public.generate_guild_code() WHERE guild_code IS NULL OR guild_code = '';
ALTER TABLE public.guilds ALTER COLUMN guild_code SET NOT NULL;
ALTER TABLE public.guilds ADD CONSTRAINT guilds_guild_code_unique UNIQUE (guild_code);

-- 2. Create notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type text NOT NULL,
  title text NOT NULL,
  body text NOT NULL,
  guild_id uuid REFERENCES public.guilds(id) ON DELETE CASCADE,
  from_user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- RLS for notifications
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own notifications" ON public.notifications;
CREATE POLICY "Users can view own notifications" ON public.notifications
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "System can insert notifications" ON public.notifications;
CREATE POLICY "System can insert notifications" ON public.notifications
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Users can update own notifications" ON public.notifications;
CREATE POLICY "Users can update own notifications" ON public.notifications
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own notifications" ON public.notifications;
CREATE POLICY "Users can delete own notifications" ON public.notifications
  FOR DELETE USING (auth.uid() = user_id);

-- Index for fast unread count
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON public.notifications (user_id, read) WHERE read = false;
