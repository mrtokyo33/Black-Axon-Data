/*
  # Create user profiles table

  1. New Tables
    - `user_profiles`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `username` (text, unique)
      - `purpose` (text, constrained to: start, explore, improve)
      - `education_level` (text, constrained to: school, college, hobby)
      - `xp` (integer, default 0)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS
    - Add policies for authenticated users to:
      - Read their own profile
      - Update their own profile
      - Insert their own profile

  3. Automation
    - Add trigger for automatic updated_at timestamp updates
*/

-- Create user_profiles table if it doesn't exist
DO $$ BEGIN
  CREATE TABLE IF NOT EXISTS user_profiles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) NOT NULL,
    username text UNIQUE NOT NULL,
    purpose text NOT NULL,
    education_level text NOT NULL,
    xp integer NOT NULL DEFAULT 0,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    
    -- Add check constraints for valid values
    CONSTRAINT valid_purpose CHECK (purpose IN ('start', 'explore', 'improve')),
    CONSTRAINT valid_education_level CHECK (education_level IN ('school', 'college', 'hobby')),
    CONSTRAINT valid_xp CHECK (xp >= 0)
  );
EXCEPTION
  WHEN duplicate_table THEN
    NULL;
END $$;

-- Enable Row Level Security if not already enabled
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DO $$ BEGIN
  DROP POLICY IF EXISTS "Users can read own profile" ON user_profiles;
  DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
  DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;
EXCEPTION
  WHEN undefined_object THEN
    NULL;
END $$;

-- Create policies
CREATE POLICY "Users can read own profile"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create or replace the function for updating the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop the trigger if it exists and recreate it
DO $$ BEGIN
  DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles;
EXCEPTION
  WHEN undefined_object THEN
    NULL;
END $$;

CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE
  ON user_profiles
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();