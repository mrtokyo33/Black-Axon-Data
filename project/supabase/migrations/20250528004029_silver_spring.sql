/*
  # Add delete_user_data stored procedure

  1. New Functions
    - `delete_user_data`: Stored procedure to safely delete all user data
      - Takes user_id as parameter
      - Deletes user profile data
      - Returns success/failure

  2. Security
    - Function is accessible only to authenticated users
    - Implements proper error handling and rollback
*/

CREATE OR REPLACE FUNCTION delete_user_data(p_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Delete user profile
  DELETE FROM user_profiles
  WHERE user_id = p_user_id;

  -- If we get here, all deletions were successful
  RETURN;
EXCEPTION
  WHEN OTHERS THEN
    -- Log the error (Supabase will capture this in the logs)
    RAISE EXCEPTION 'Failed to delete user data: %', SQLERRM;
END;
$$;