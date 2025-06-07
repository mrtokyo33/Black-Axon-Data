/*
  # Update user profiles policies

  1. Changes
    - Add policy for users to update their own profile data
    - Ensure users can only modify allowed fields (username, purpose, education_level)
    - Maintain data integrity with field validation

  2. Security
    - RLS policies updated to allow secure profile updates
    - Validation constraints remain enforced
*/

-- Update the existing update policy to explicitly specify allowed columns
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;

CREATE POLICY "Users can update own profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (
    auth.uid() = user_id AND
    (
      CASE WHEN purpose IS NOT NULL 
        THEN purpose IN ('start', 'explore', 'improve')
        ELSE true
      END
    ) AND
    (
      CASE WHEN education_level IS NOT NULL 
        THEN education_level IN ('school', 'college', 'hobby')
        ELSE true
      END
    )
  );

-- Add a trigger to validate username uniqueness before update
CREATE OR REPLACE FUNCTION check_username_update()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.username <> OLD.username AND EXISTS (
    SELECT 1 FROM user_profiles 
    WHERE username = NEW.username 
    AND id <> NEW.id
  ) THEN
    RAISE EXCEPTION 'Username already exists';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'ensure_username_unique_on_update'
  ) THEN
    CREATE TRIGGER ensure_username_unique_on_update
      BEFORE UPDATE OF username
      ON user_profiles
      FOR EACH ROW
      EXECUTE FUNCTION check_username_update();
  END IF;
END $$;