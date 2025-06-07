/*
  # User Profiles Schema

  1. New Tables
    - `user_profiles`
      - `id` (uuid, primary key) - Unique identifier for the profile
      - `user_id` (uuid) - Foreign key to auth.users table
      - `username` (text) - Unique username for the user
      - `purpose` (text) - User's learning purpose (start, explore, improve)
      - `education_level` (text) - User's education level (school, college, hobby)
      - `xp` (integer) - User's experience points
      - `created_at` (timestamp) - Profile creation timestamp
      - `updated_at` (timestamp) - Profile last update timestamp

  2. Security
    - Enable RLS on user_profiles table
    - Add policies for:
      - Users can read their own profile
      - Users can update their own profile
      - Users can insert their own profile
    
  3. Constraints
    - Username must be unique
    - Purpose must be one of: start, explore, improve
    - Education level must be one of: school, college, hobby
    - XP must be non-negative
*/

-- Create user_profiles table
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

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

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

-- Create trigger to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE
  ON user_profiles
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();