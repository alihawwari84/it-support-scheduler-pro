-- Insert default ticket categories
INSERT INTO public.ticket_categories (name, description) VALUES
('Hardware', 'Hardware-related issues like computer problems, printer issues, etc.'),
('Software', 'Software installation, configuration, and troubleshooting'),
('Network', 'Network connectivity, internet, and Wi-Fi issues'),
('Email', 'Email setup, configuration, and troubleshooting'),
('Security', 'Security incidents, password resets, and access issues'),
('Other', 'General IT support requests that don''t fit other categories');