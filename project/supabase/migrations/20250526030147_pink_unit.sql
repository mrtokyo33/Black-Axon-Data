/*
  # Add cascade delete functionality
  
  1. Changes
    - Add policy for users to delete their own profiles (if not exists)
    - Add cascade delete trigger for user deletion (if not exists)
  
  2. Security
    - Only authenticated users can delete their own profiles
    - Automatic cleanup of user profiles when auth.users entries are deleted
*/

-- Only create the policy if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'user_profiles' 
    AND policyname = 'Users can delete own profile'
  ) THEN
    CREATE POLICY "Users can delete own profile"
      ON user_profiles
      FOR DELETE
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;
END $$;

-- Only create the function if it doesn't exist
CREATE OR REPLACE FUNCTION handle_deleted_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Delete user profile when user is deleted
  DELETE FROM user_profiles WHERE user_id = OLD.id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Only create the trigger if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'on_auth_user_deleted'
  ) THEN
    CREATE TRIGGER on_auth_user_deleted
      AFTER DELETE ON auth.users
      FOR EACH ROW EXECUTE FUNCTION handle_deleted_user();
  END IF;
END $$;