-- Migration: Create Group Chat Messages Table
CREATE TABLE group_messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  group_id UUID REFERENCES groups(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE group_messages ENABLE ROW LEVEL SECURITY;

-- Select policy: any group member can select messages
CREATE POLICY "Group members can view chat messages" ON group_messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM group_members
      WHERE group_id = group_messages.group_id AND user_id = auth.uid() AND status = 'approved'
    )
    OR EXISTS (
      SELECT 1 FROM groups
      WHERE id = group_messages.group_id AND admin_id = auth.uid()
    )
  );

-- Insert policy: group members can insert their own messages
CREATE POLICY "Group members can insert own chat messages" ON group_messages
  FOR INSERT WITH CHECK (
    user_id = auth.uid()
    AND (
      EXISTS (
        SELECT 1 FROM group_members
        WHERE group_id = group_messages.group_id AND user_id = auth.uid() AND status = 'approved'
      )
      OR EXISTS (
        SELECT 1 FROM groups
        WHERE id = group_messages.group_id AND admin_id = auth.uid()
      )
    )
  );
