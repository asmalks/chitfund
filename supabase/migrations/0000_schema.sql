-- ROSCA Manager Database Schema

-- Users table linking to Supabase Auth
CREATE TABLE users (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  phone TEXT UNIQUE NOT NULL,
  name TEXT,
  profile_photo_url TEXT,
  verification_status TEXT DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);

-- Groups table
CREATE TABLE groups (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  admin_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  monthly_amount DECIMAL NOT NULL,
  duration_months INTEGER NOT NULL,
  start_date DATE NOT NULL,
  max_members INTEGER NOT NULL,
  status TEXT DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'active', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE groups ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can insert groups" ON groups FOR INSERT WITH CHECK (auth.uid() = admin_id);
CREATE POLICY "Admins can push updates" ON groups FOR UPDATE USING (auth.uid() = admin_id);

-- Group Members table
CREATE TABLE group_members (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  group_id UUID REFERENCES groups(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'left')),
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(group_id, user_id)
);

ALTER TABLE group_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Members can view their groups" ON group_members FOR SELECT USING (user_id = auth.uid() OR EXISTS(SELECT 1 FROM groups WHERE id = group_members.group_id AND admin_id = auth.uid()));
CREATE POLICY "Users can insert their join request" ON group_members FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Admins can update membership" ON group_members FOR UPDATE USING (EXISTS(SELECT 1 FROM groups WHERE id = group_members.group_id AND admin_id = auth.uid()));

-- Add the groups SELECT policy now that group_members exists
CREATE POLICY "Anyone can view groups they are part of" ON groups
  FOR SELECT USING (
    admin_id = auth.uid() OR
    EXISTS (SELECT 1 FROM group_members WHERE group_id = groups.id AND user_id = auth.uid())
  );

-- Payments (Ledger)
CREATE TABLE payments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  group_id UUID REFERENCES groups(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  cycle_month INTEGER NOT NULL,
  amount DECIMAL NOT NULL,
  status TEXT DEFAULT 'due' CHECK (status IN ('due', 'pending_verification', 'paid', 'overdue')),
  payment_method TEXT CHECK (payment_method IN ('upi', 'cash', 'bank_transfer', null)),
  proof_url TEXT,
  due_date DATE NOT NULL,
  paid_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(group_id, user_id, cycle_month)
);

ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Members can view group payments" ON payments FOR SELECT USING (EXISTS(SELECT 1 FROM group_members WHERE group_id = payments.group_id AND user_id = auth.uid()) OR EXISTS(SELECT 1 FROM groups WHERE id = payments.group_id AND admin_id = auth.uid()));
CREATE POLICY "Users can update own payments (upload proof)" ON payments FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Admins can verify payments" ON payments FOR UPDATE USING (EXISTS(SELECT 1 FROM groups WHERE id = payments.group_id AND admin_id = auth.uid()));

-- Payouts
CREATE TABLE payouts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  group_id UUID REFERENCES groups(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  cycle_month INTEGER NOT NULL,
  amount DECIMAL NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed')),
  completed_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(group_id, cycle_month)
);

ALTER TABLE payouts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Members can view payouts" ON payouts FOR SELECT USING (EXISTS(SELECT 1 FROM group_members WHERE group_id = payouts.group_id AND user_id = auth.uid()) OR EXISTS(SELECT 1 FROM groups WHERE id = payouts.group_id AND admin_id = auth.uid()));
CREATE POLICY "Admins can complete payouts" ON payouts FOR UPDATE USING (EXISTS(SELECT 1 FROM groups WHERE id = payouts.group_id AND admin_id = auth.uid()));

-- Notifications
CREATE TABLE notifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT CHECK (type IN ('reminder', 'payout', 'join_request')),
  read_status BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own notifications" ON notifications FOR SELECT USING (user_id = auth.uid());

-- Subscriptions
CREATE TABLE subscriptions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  plan_type TEXT DEFAULT 'free' CHECK (plan_type IN ('free', 'pro', 'enterprise')),
  valid_until TIMESTAMP WITH TIME ZONE,
  UNIQUE(user_id)
);

ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own subscription" ON subscriptions FOR SELECT USING (user_id = auth.uid());
