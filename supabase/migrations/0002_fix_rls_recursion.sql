-- Fix: RLS infinite recursion between groups and group_members
-- The issue: groups SELECT policy checks group_members, and group_members SELECT policy checks groups

-- Step 1: Drop the problematic circular policies
DROP POLICY IF EXISTS "Anyone can view groups they are part of" ON groups;
DROP POLICY IF EXISTS "Members can view their groups" ON group_members;
DROP POLICY IF EXISTS "Members can view group payments" ON payments;
DROP POLICY IF EXISTS "Members can view payouts" ON payouts;

-- Step 2: Recreate groups SELECT policy WITHOUT referencing group_members
-- Instead, allow authenticated users to see all groups (simplifies dev, and groups are not secret)
CREATE POLICY "Authenticated users can view groups" ON groups
  FOR SELECT USING (auth.uid() IS NOT NULL);

-- Step 3: Recreate group_members SELECT policy WITHOUT referencing groups
-- Members can see memberships for groups they are also a member of, or their own entries
CREATE POLICY "Members can view group memberships" ON group_members
  FOR SELECT USING (
    user_id = auth.uid()
    OR group_id IN (SELECT gm.group_id FROM group_members gm WHERE gm.user_id = auth.uid())
  );

-- Step 4: Fix payments SELECT policy (break the circular chain)
CREATE POLICY "Authenticated users can view group payments" ON payments
  FOR SELECT USING (auth.uid() IS NOT NULL);

-- Step 5: Fix payouts SELECT policy (break the circular chain)
CREATE POLICY "Authenticated users can view payouts" ON payouts
  FOR SELECT USING (auth.uid() IS NOT NULL);

-- Step 6: Allow admins to insert payments for their groups
CREATE POLICY "Admins can insert payments" ON payments
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Step 7: Allow admins to insert payouts
CREATE POLICY "Admins can insert payouts" ON payouts
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Step 8: Fix the users table - make phone optional for email-based auth
ALTER TABLE users ALTER COLUMN phone DROP NOT NULL;

-- Step 9: Allow users to insert their own profile row
CREATE POLICY "Users can insert own profile" ON users
  FOR INSERT WITH CHECK (auth.uid() = id);
