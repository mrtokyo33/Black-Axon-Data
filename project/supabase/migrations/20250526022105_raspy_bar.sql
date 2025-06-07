/*
  # Add delete profile policy

  1. Changes
    - Add policy to allow users to delete their own profile

  2. Security
    - Users can only delete their own profile
    - RLS is already enabled on the user_profiles table
*/

CREATE POLICY "Users can delete own profile"
  ON user_profiles
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);