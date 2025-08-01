-- Reset all data in tables (delete all records including default categories)
TRUNCATE TABLE public.ticket_comments CASCADE;
TRUNCATE TABLE public.tickets CASCADE;
TRUNCATE TABLE public.companies CASCADE;
TRUNCATE TABLE public.ticket_categories CASCADE;