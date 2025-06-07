/*
  # Add delete account policies

  1. Changes
    - Add policy to allow users to delete their own account
    - Add policy to cascade delete user data when account is deleted

  2. Security
    - Only authenticated users can delete their own account
    - Ensures all user data is properly cleaned up
*/

-- Add policy to allow users to delete their own profile
CREATE POLICY "Users can delete own profile"
  ON user_profiles
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Add cascade delete trigger
CREATE OR REPLACE FUNCTION handle_deleted_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Delete user profile when user is deleted
  DELETE FROM user_profiles WHERE user_id = OLD.id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_deleted
  AFTER DELETE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_deleted_user();