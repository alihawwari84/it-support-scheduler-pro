-- Disable RLS on all tables for public access without authentication
ALTER TABLE public.employees DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.allocations DISABLE ROW LEVEL SECURITY;

-- Add proper foreign key constraints for data integrity
ALTER TABLE public.allocations 
ADD CONSTRAINT fk_allocations_employee 
FOREIGN KEY (employee_id) REFERENCES public.employees(id) ON DELETE CASCADE;

ALTER TABLE public.allocations 
ADD CONSTRAINT fk_allocations_project 
FOREIGN KEY (project_id) REFERENCES public.projects(id) ON DELETE CASCADE;

-- Add some indexes for better performance
CREATE INDEX idx_allocations_employee_id ON public.allocations(employee_id);
CREATE INDEX idx_allocations_project_id ON public.allocations(project_id);
CREATE INDEX idx_employees_email ON public.employees(email);

-- Add unique constraint on employee email
ALTER TABLE public.employees ADD CONSTRAINT unique_employee_email UNIQUE (email);