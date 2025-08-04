-- Add time_spent column to track actual hours spent on tickets
ALTER TABLE public.tickets 
ADD COLUMN time_spent NUMERIC DEFAULT 0;