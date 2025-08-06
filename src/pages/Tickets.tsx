
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Clock, FileText, Users, Calendar, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useTickets } from "@/hooks/useTickets";
import { useCompanies } from "@/hooks/useCompanies";
import { useTicketCategories } from "@/hooks/useTicketCategories";
import { format } from "date-fns";

const Tickets = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [companyFilter, setCompanyFilter] = useState("all");
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [updateStatus, setUpdateStatus] = useState("");
  const [timeSpent, setTimeSpent] = useState("");
  const { toast } = useToast();

  const { tickets, loading: ticketsLoading, updateTicket } = useTickets();
  const { companies, loading: companiesLoading } = useCompanies();
  const { categories } = useTicketCategories();

  const filteredTickets = useMemo(() => {
    return tickets.filter(ticket => {
      const companyName = ticket.companies?.name || '';
      const matchesSearch = ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           companyName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "all" || ticket.status === statusFilter;
      const matchesCompany = companyFilter === "all" || ticket.company_id === companyFilter;
      
      return matchesSearch && matchesStatus && matchesCompany;
    });
  }, [tickets, searchTerm, statusFilter, companyFilter]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open": return "destructive";
      case "in_progress": return "default";
      case "resolved": return "secondary";
      case "closed": return "outline";
      default: return "secondary";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "text-red-600";
      case "medium": return "text-yellow-600";
      case "low": return "text-green-600";
      default: return "text-muted-foreground";
    }
  };

  const handleUpdateTicket = (ticket: any) => {
    setSelectedTicket(ticket);
    setUpdateStatus(ticket.status);
    setTimeSpent(ticket.time_spent?.toString() || "0");
  };

  const saveTicketUpdate = async () => {
    if (!selectedTicket) return;

    try {
      await updateTicket(selectedTicket.id, { 
        status: updateStatus,
        time_spent: parseFloat(timeSpent) || 0
      });
      setSelectedTicket(null);
      setUpdateStatus("");
      setTimeSpent("");
    } catch (error) {
      // Error handling is done in the hook
      console.error('Failed to update ticket:', error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Support Tickets</h1>
              <p className="text-muted-foreground">Manage all IT support requests</p>
            </div>
            <div className="flex gap-2">
              <Link to="/">
                <Button variant="outline">Dashboard</Button>
              </Link>
              <Link to="/tickets/new">
                <Button>New Ticket</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Filter Tickets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Search</label>
                <Input
                  placeholder="Search tickets or companies..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Status</label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All statuses</SelectItem>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Company</label>
                <Select value={companyFilter} onValueChange={setCompanyFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All companies" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All companies</SelectItem>
                    {companies.map(company => (
                      <SelectItem key={company.id} value={company.id}>{company.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Loading State */}
        {(ticketsLoading || companiesLoading) && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Loading tickets...</span>
          </div>
        )}

        {/* Tickets List */}
        {!ticketsLoading && !companiesLoading && (
          <div className="space-y-4">
            {filteredTickets.map((ticket) => (
              <Card key={ticket.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-lg">{ticket.title}</h3>
                        <Badge variant={getStatusColor(ticket.status)}>
                          {ticket.status.replace('_', ' ')}
                        </Badge>
                        <span className={`text-sm font-medium ${getPriorityColor(ticket.priority)}`}>
                          {ticket.priority} priority
                        </span>
                      </div>
                      
                      <p className="text-muted-foreground mb-3">{ticket.description}</p>
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          <span>{ticket.companies?.name || 'No company'}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <FileText className="h-4 w-4" />
                          <span>{ticket.ticket_categories?.name || 'No category'}</span>
                        </div>
                        {ticket.due_date && (
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>Due: {format(new Date(ticket.due_date), 'MMM dd, yyyy')}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-right ml-4">
                      <div className="text-sm text-muted-foreground mb-2">
                        Created: {format(new Date(ticket.created_at), 'MMM dd, yyyy HH:mm')}
                      </div>
                      <div className="flex gap-2">
                        <Link to={`/tickets/${ticket.id}`}>
                          <Button variant="outline" size="sm">View</Button>
                        </Link>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm" onClick={() => handleUpdateTicket(ticket)}>
                              Update
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Update Ticket</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <h4 className="font-semibold">{ticket.title}</h4>
                                <p className="text-sm text-muted-foreground">{ticket.companies?.name}</p>
                              </div>
                              <div>
                                <label className="text-sm font-medium mb-2 block">Status</label>
                                <Select value={updateStatus} onValueChange={setUpdateStatus}>
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="open">Open</SelectItem>
                                    <SelectItem value="in_progress">In Progress</SelectItem>
                                    <SelectItem value="resolved">Resolved</SelectItem>
                                    <SelectItem value="closed">Closed</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div>
                                <label className="text-sm font-medium mb-2 block">Time Spent (hours)</label>
                                <Input
                                  type="number"
                                  step="0.5"
                                  min="0"
                                  value={timeSpent}
                                  onChange={(e) => setTimeSpent(e.target.value)}
                                  placeholder="Enter hours spent on this ticket"
                                />
                              </div>
                              <div className="flex gap-2 pt-4">
                                <Button onClick={saveTicketUpdate} className="flex-1">
                                  Save Changes
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!ticketsLoading && !companiesLoading && filteredTickets.length === 0 && (
          <Card>
            <CardContent className="text-center py-8">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No tickets found</h3>
              <p className="text-muted-foreground">Try adjusting your filters or create a new ticket.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Tickets;
