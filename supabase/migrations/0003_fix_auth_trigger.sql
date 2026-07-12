-- Fix: Auth trigger to handle email-based signups (phone may be null)
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, phone, name)
  VALUES (
    new.id, 
    COALESCE(new.phone, ''), 
    COALESCE(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1))
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
