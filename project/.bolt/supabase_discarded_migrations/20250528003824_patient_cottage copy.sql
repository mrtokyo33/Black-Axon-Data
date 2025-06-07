/*
  # Add cascade delete trigger for user profiles

  This migration adds a trigger to automatically delete user profiles when a user is deleted from auth.users.
  
  1. Changes
    - Add trigger function to handle user deletion
    - Add trigger to auth.users table
*/

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