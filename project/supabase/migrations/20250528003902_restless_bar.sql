/*
  # Update user deletion trigger

  This migration updates the trigger system for handling user deletions by:
  1. Dropping existing trigger and function
  2. Recreating the function with updated logic
  3. Creating new trigger
*/

-- Drop existing trigger and function if they exist
DROP TRIGGER IF EXISTS on_auth_user_deleted ON auth.users;
DROP FUNCTION IF EXISTS handle_deleted_user();

-- Recreate the function with updated logic
CREATE OR REPLACE FUNCTION handle_deleted_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Delete user profile when user is deleted
  DELETE FROM user_profiles WHERE user_id = OLD.id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger
CREATE TRIGGER on_auth_user_deleted
  AFTER DELETE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_deleted_user();