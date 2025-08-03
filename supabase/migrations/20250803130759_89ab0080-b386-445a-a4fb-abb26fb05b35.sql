-- Add financial fields to companies table
ALTER TABLE public.companies 
ADD COLUMN salary DECIMAL(10,2),
ADD COLUMN hours_per_month INTEGER;