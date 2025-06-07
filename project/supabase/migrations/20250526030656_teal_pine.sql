/*
  # Add delete user function
  
  1. New Functions
    - `delete_user_data`: Deletes all user data across tables
  
  2. Changes
    - Creates a stored procedure to handle user deletion in a transaction
    
  3. Security
    - Function is marked as SECURITY DEFINER to run with elevated privileges
*/

-- Create a function to delete all user data in a transaction
CREATE OR REPLACE FUNCTION delete_user_data(p_user_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Start transaction
  BEGIN
    -- Delete user profile
    DELETE FROM user_profiles WHERE user_id = p_user_id;
    
    -- Add any other tables that contain user data here
    -- Example:
    -- DELETE FROM user_preferences WHERE user_id = p_user_id;
    -- DELETE FROM user_achievements WHERE user_id = p_user_id;
    
    -- If we get here, commit the transaction
    COMMIT;
  EXCEPTION WHEN OTHERS THEN
    -- If any error occurs, rollback all changes
    ROLLBACK;
    RAISE EXCEPTION 'Failed to delete user data: %', SQLERRM;
  END;
END;
$$;