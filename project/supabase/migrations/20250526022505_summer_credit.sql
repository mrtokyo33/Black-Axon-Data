/*
  # Add cascade delete trigger for user accounts
  
  1. Changes
    - Add trigger to automatically delete user profile when auth.users record is deleted
  
  2. Security
    - Trigger runs with SECURITY DEFINER to ensure it has necessary permissions
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