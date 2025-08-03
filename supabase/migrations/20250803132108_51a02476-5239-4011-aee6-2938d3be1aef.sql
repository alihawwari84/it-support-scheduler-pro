-- Add missing notes column to companies table
ALTER TABLE public.companies 
ADD COLUMN notes TEXT;