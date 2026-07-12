-- Consolidated SQL Setup Script for Supabase SQL Editor
-- Paste this script into your Supabase Dashboard -> SQL Editor and click 'Run'.

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Create Users Table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  phone TEXT DEFAULT '',
  name TEXT,
  profile_photo_url TEXT,
  verification_status TEXT DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create Groups Table
CREATE TABLE IF NOT EXISTS public.groups (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  admin_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  monthly_amount DECIMAL NOT NULL,
  duration_months INTEGER NOT NULL,
  start_date DATE NOT NULL,
  max_members INTEGER NOT NULL,
  status TEXT DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'active', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create Group Members Table
CREATE TABLE IF NOT EXISTS public.group_members (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  group_id UUID REFERENCES public.groups(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'left')),
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(group_id, user_id)
);

-- 4. Create Payments Table (Ledger)
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  group_id UUID REFERENCES public.groups(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  cycle_month INTEGER NOT NULL,
  amount DECIMAL NOT NULL,
  status TEXT DEFAULT 'due' CHECK (status IN ('due', 'pending_verification', 'paid', 'overdue')),
  payment_method TEXT CHECK (payment_method IN ('upi', 'cash', 'bank_transfer', null)),
  proof_url TEXT,
  due_date DATE NOT NULL,
  paid_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(group_id, user_id, cycle_month)
);

-- 5. Create Payouts Table
CREATE TABLE IF NOT EXISTS public.payouts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  group_id UUID REFERENCES public.groups(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  cycle_month INTEGER NOT NULL,
  amount DECIMAL NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed')),
  completed_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(group_id, cycle_month)
);

-- 6. Create Notifications Table
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT CHECK (type IN ('reminder', 'payout', 'join_request')),
  read_status BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. Create Subscriptions Table
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  plan_type TEXT DEFAULT 'free' CHECK (plan_type IN ('free', 'pro', 'enterprise')),
  valid_until TIMESTAMP WITH TIME ZONE,
  UNIQUE(user_id)
);

-- 8. Create Group Messages Table (Chat)
CREATE TABLE IF NOT EXISTS public.group_messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  group_id UUID REFERENCES public.groups(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS) on all Tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_messages ENABLE ROW LEVEL SECURITY;

-- 9. Setup RLS Security Policies

-- Users Policies
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.users;
CREATE POLICY "Users can view own profile" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.users FOR INSERT WITH CHECK (auth.uid() = id);

-- Groups Policies
DROP POLICY IF EXISTS "Authenticated users can view groups" ON public.groups;
DROP POLICY IF EXISTS "Admins can insert groups" ON public.groups;
DROP POLICY IF EXISTS "Admins can push updates" ON public.groups;
CREATE POLICY "Authenticated users can view groups" ON public.groups FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Admins can insert groups" ON public.groups FOR INSERT WITH CHECK (auth.uid() = admin_id);
CREATE POLICY "Admins can push updates" ON public.groups FOR UPDATE USING (auth.uid() = admin_id);

-- Group Members Policies
DROP POLICY IF EXISTS "Members can view group memberships" ON public.group_members;
DROP POLICY IF EXISTS "Users can insert their join request" ON public.group_members;
DROP POLICY IF EXISTS "Admins can update membership" ON public.group_members;
CREATE POLICY "Members can view group memberships" ON public.group_members FOR SELECT USING (
  user_id = auth.uid() OR group_id IN (SELECT gm.group_id FROM public.group_members gm WHERE gm.user_id = auth.uid())
);
CREATE POLICY "Users can insert their join request" ON public.group_members FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Admins can update membership" ON public.group_members FOR UPDATE USING (EXISTS(SELECT 1 FROM public.groups WHERE id = group_members.group_id AND admin_id = auth.uid()));

-- Payments Policies
DROP POLICY IF EXISTS "Authenticated users can view group payments" ON public.payments;
DROP POLICY IF EXISTS "Users can update own payments (upload proof)" ON public.payments;
DROP POLICY IF EXISTS "Admins can verify payments" ON public.payments;
DROP POLICY IF EXISTS "Admins can insert payments" ON public.payments;
CREATE POLICY "Authenticated users can view group payments" ON public.payments FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Users can update own payments (upload proof)" ON public.payments FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Admins can verify payments" ON public.payments FOR UPDATE USING (EXISTS(SELECT 1 FROM public.groups WHERE id = payments.group_id AND admin_id = auth.uid()));
CREATE POLICY "Admins can insert payments" ON public.payments FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Payouts Policies
DROP POLICY IF EXISTS "Authenticated users can view payouts" ON public.payouts;
DROP POLICY IF EXISTS "Admins can complete payouts" ON public.payouts;
DROP POLICY IF EXISTS "Admins can insert payouts" ON public.payouts;
CREATE POLICY "Authenticated users can view payouts" ON public.payouts FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Admins can complete payouts" ON public.payouts FOR UPDATE USING (EXISTS(SELECT 1 FROM public.groups WHERE id = payouts.group_id AND admin_id = auth.uid()));
CREATE POLICY "Admins can insert payouts" ON public.payouts FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Notifications Policies
DROP POLICY IF EXISTS "Users can read own notifications" ON public.notifications;
CREATE POLICY "Users can read own notifications" ON public.notifications FOR SELECT USING (user_id = auth.uid());

-- Subscriptions Policies
DROP POLICY IF EXISTS "Users can read own subscription" ON public.subscriptions;
CREATE POLICY "Users can read own subscription" ON public.subscriptions FOR SELECT USING (user_id = auth.uid());

-- Group Messages Policies
DROP POLICY IF EXISTS "Group members can view chat messages" ON public.group_messages;
DROP POLICY IF EXISTS "Group members can insert own chat messages" ON public.group_messages;
CREATE POLICY "Group members can view chat messages" ON public.group_messages FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.group_members WHERE group_id = group_messages.group_id AND user_id = auth.uid() AND status = 'approved')
  OR EXISTS (SELECT 1 FROM public.groups WHERE id = group_messages.group_id AND admin_id = auth.uid())
);
CREATE POLICY "Group members can insert own chat messages" ON public.group_messages FOR INSERT WITH CHECK (
  user_id = auth.uid() AND (
    EXISTS (SELECT 1 FROM public.group_members WHERE group_id = group_messages.group_id AND user_id = auth.uid() AND status = 'approved')
    OR EXISTS (SELECT 1 FROM public.groups WHERE id = group_messages.group_id AND admin_id = auth.uid())
  )
);

-- 10. Auth Trigger: auto-create public.users row on Auth Sign Up
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

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
