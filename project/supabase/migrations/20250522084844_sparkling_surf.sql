/*
  # Add XP field to user_profiles table

  1. Changes
    - Add `xp` column to user_profiles table with default value of 0
    - Add check constraint to ensure XP is non-negative
*/

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_profiles' AND column_name = 'xp'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN xp integer NOT NULL DEFAULT 0;
    ALTER TABLE user_profiles ADD CONSTRAINT valid_xp CHECK (xp >= 0);
  END IF;
END $$;