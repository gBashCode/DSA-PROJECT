-- Auto-create a profile row when a new user signs up
-- This runs server-side, bypassing RLS

-- 1. Create the function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, username, display_name, avatar, bio)
  VALUES (
    NEW.id,
    LOWER(COALESCE(NEW.raw_user_meta_data ->> 'username', split_part(NEW.email, '@', 1))),
    COALESCE(NEW.raw_user_meta_data ->> 'display_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data ->> 'avatar', '🧑‍💻'),
    COALESCE(NEW.raw_user_meta_data ->> 'bio', '')
  );
  RETURN NEW;
END;
$$;

-- 2. Create the trigger
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
