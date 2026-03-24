-- Add usertype column to USERS table
-- Values: 'Tutor' or 'Tutee'

ALTER TABLE "USERS" ADD COLUMN IF NOT EXISTS usertype text;
