-- Reset all data in tables (delete all records)
TRUNCATE TABLE public.ticket_comments CASCADE;
TRUNCATE TABLE public.tickets CASCADE;
TRUNCATE TABLE public.companies CASCADE;
TRUNCATE TABLE public.ticket_categories CASCADE;

-- Re-insert default ticket categories
INSERT INTO public.ticket_categories (name, description) VALUES
  ('Hardware Issue', 'Problems with computer hardware, peripherals, or equipment'),
  ('Software Issue', 'Software bugs, application problems, or installation issues'),
  ('Network Issue', 'Internet connectivity, network access, or network performance problems'),
  ('Account Access', 'Login problems, password resets, or account permissions'),
  ('Email Issue', 'Email delivery, configuration, or access problems'),
  ('Printer Issue', 'Printer connectivity, driver, or printing quality problems'),
  ('Security Incident', 'Security breaches, suspicious activity, or security policy violations'),
  ('New User Setup', 'Setting up new employee accounts and equipment'),
  ('General Support', 'General IT questions or requests that do not fit other categories');