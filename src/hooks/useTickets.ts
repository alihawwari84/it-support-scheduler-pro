import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Ticket {
  id: string;
  title: string;
  description?: string;
  status: string;
  priority: string;
  company_id?: string;
  category_id?: string;
  assigned_to?: string;
  reporter_name?: string;
  reporter_email?: string;
  due_date?: string;
  resolved_at?: string;
  created_at: string;
  updated_at: string;
}

interface TicketWithCompany extends Ticket {
  companies?: {
    name: string;
  };
  ticket_categories?: {
    name: string;
  };
}

export const useTickets = () => {
  const [tickets, setTickets] = useState<TicketWithCompany[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('tickets')
        .select(`
          *,
          companies (name),
          ticket_categories (name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTickets(data || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch tickets';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createTicket = async (ticketData: Omit<Ticket, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('tickets')
        .insert([ticketData])
        .select(`
          *,
          companies (name),
          ticket_categories (name)
        `)
        .single();

      if (error) throw error;

      setTickets(prev => [data, ...prev]);
      toast({
        title: "Success",
        description: "Ticket created successfully",
      });
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create ticket';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      throw err;
    }
  };

  const updateTicket = async (id: string, updates: Partial<Omit<Ticket, 'id' | 'created_at' | 'updated_at'>>) => {
    try {
      const { data, error } = await supabase
        .from('tickets')
        .update(updates)
        .eq('id', id)
        .select(`
          *,
          companies (name),
          ticket_categories (name)
        `)
        .single();

      if (error) throw error;

      setTickets(prev => prev.map(ticket => 
        ticket.id === id ? data : ticket
      ));
      toast({
        title: "Success",
        description: "Ticket updated successfully",
      });
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update ticket';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      throw err;
    }
  };

  const deleteTicket = async (id: string) => {
    try {
      const { error } = await supabase
        .from('tickets')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setTickets(prev => prev.filter(ticket => ticket.id !== id));
      toast({
        title: "Success",
        description: "Ticket deleted successfully",
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete ticket';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      throw err;
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  return {
    tickets,
    loading,
    error,
    fetchTickets,
    createTicket,
    updateTicket,
    deleteTicket,
  };
};