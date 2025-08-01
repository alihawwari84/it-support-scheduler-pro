-- Create companies table
CREATE TABLE public.companies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  contact_email TEXT,
  contact_phone TEXT,
  address TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create ticket categories table
CREATE TABLE public.ticket_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create tickets table
CREATE TABLE public.tickets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
  category_id UUID REFERENCES public.ticket_categories(id) ON DELETE SET NULL,
  assigned_to TEXT,
  reporter_email TEXT,
  reporter_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  resolved_at TIMESTAMP WITH TIME ZONE,
  due_date TIMESTAMP WITH TIME ZONE
);

-- Create ticket comments table
CREATE TABLE public.ticket_comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ticket_id UUID NOT NULL REFERENCES public.tickets(id) ON DELETE CASCADE,
  author_name TEXT,
  author_email TEXT,
  comment TEXT NOT NULL,
  is_internal BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ticket_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ticket_comments ENABLE ROW LEVEL SECURITY;

-- Create permissive policies (you should update these based on your auth requirements)
CREATE POLICY "Anyone can view companies" ON public.companies FOR SELECT USING (true);
CREATE POLICY "Anyone can create companies" ON public.companies FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update companies" ON public.companies FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete companies" ON public.companies FOR DELETE USING (true);

CREATE POLICY "Anyone can view ticket categories" ON public.ticket_categories FOR SELECT USING (true);
CREATE POLICY "Anyone can create ticket categories" ON public.ticket_categories FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update ticket categories" ON public.ticket_categories FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete ticket categories" ON public.ticket_categories FOR DELETE USING (true);

CREATE POLICY "Anyone can view tickets" ON public.tickets FOR SELECT USING (true);
CREATE POLICY "Anyone can create tickets" ON public.tickets FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update tickets" ON public.tickets FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete tickets" ON public.tickets FOR DELETE USING (true);

CREATE POLICY "Anyone can view ticket comments" ON public.ticket_comments FOR SELECT USING (true);
CREATE POLICY "Anyone can create ticket comments" ON public.ticket_comments FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update ticket comments" ON public.ticket_comments FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete ticket comments" ON public.ticket_comments FOR DELETE USING (true);

-- Create indexes for better performance
CREATE INDEX idx_tickets_company_id ON public.tickets(company_id);
CREATE INDEX idx_tickets_category_id ON public.tickets(category_id);
CREATE INDEX idx_tickets_status ON public.tickets(status);
CREATE INDEX idx_tickets_priority ON public.tickets(priority);
CREATE INDEX idx_tickets_created_at ON public.tickets(created_at);
CREATE INDEX idx_ticket_comments_ticket_id ON public.ticket_comments(ticket_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_companies_updated_at
  BEFORE UPDATE ON public.companies
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_tickets_updated_at
  BEFORE UPDATE ON public.tickets
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default ticket categories
INSERT INTO public.ticket_categories (name, description) VALUES
  ('Hardware Issue', 'Problems with computer hardware, peripherals, or equipment'),
  ('Software Issue', 'Software bugs, application problems, or installation issues'),
  ('Network Issue', 'Internet connectivity, network access, or network performance problems'),
  ('Account Access', 'Login problems, password resets, or account permissions'),
  ('Email Issue', 'Email delivery, configuration, or access problems'),
  ('Printer Issue', 'Printer connectivity, driver, or printing quality problems'),
  ('Security Incident', 'Security breaches, suspicious activity, or security policy violations'),
  ('New User Setup', 'Setting up new employee accounts and equipment'),
  ('General Support', 'General IT questions or requests that don\'t fit other categories');