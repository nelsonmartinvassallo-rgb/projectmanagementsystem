-- Enable Row Level Security on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_members ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view all profiles"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Projects policies
CREATE POLICY "Users can view projects they own or are members of"
  ON projects FOR SELECT
  USING (
    owner_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM project_members
      WHERE project_members.project_id = projects.id
      AND project_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create projects"
  ON projects FOR INSERT
  WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Project owners can update their projects"
  ON projects FOR UPDATE
  USING (owner_id = auth.uid());

CREATE POLICY "Project owners can delete their projects"
  ON projects FOR DELETE
  USING (owner_id = auth.uid());

-- Tasks policies
CREATE POLICY "Users can view tasks in their projects"
  ON tasks FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = tasks.project_id
      AND (
        projects.owner_id = auth.uid() OR
        EXISTS (
          SELECT 1 FROM project_members
          WHERE project_members.project_id = projects.id
          AND project_members.user_id = auth.uid()
        )
      )
    )
  );

CREATE POLICY "Users can create tasks in their projects"
  ON tasks FOR INSERT
  WITH CHECK (
    created_by = auth.uid() AND
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = tasks.project_id
      AND (
        projects.owner_id = auth.uid() OR
        EXISTS (
          SELECT 1 FROM project_members
          WHERE project_members.project_id = projects.id
          AND project_members.user_id = auth.uid()
        )
      )
    )
  );

CREATE POLICY "Users can update tasks in their projects"
  ON tasks FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = tasks.project_id
      AND (
        projects.owner_id = auth.uid() OR
        EXISTS (
          SELECT 1 FROM project_members
          WHERE project_members.project_id = projects.id
          AND project_members.user_id = auth.uid()
        )
      )
    )
  );

CREATE POLICY "Users can delete tasks they created"
  ON tasks FOR DELETE
  USING (created_by = auth.uid());

-- Project members policies
CREATE POLICY "Users can view members of their projects"
  ON project_members FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = project_members.project_id
      AND (
        projects.owner_id = auth.uid() OR
        EXISTS (
          SELECT 1 FROM project_members pm
          WHERE pm.project_id = projects.id
          AND pm.user_id = auth.uid()
        )
      )
    )
  );

CREATE POLICY "Project owners can add members"
  ON project_members FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = project_members.project_id
      AND projects.owner_id = auth.uid()
    )
  );

CREATE POLICY "Project owners can remove members"
  ON project_members FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = project_members.project_id
      AND projects.owner_id = auth.uid()
    )
  );
