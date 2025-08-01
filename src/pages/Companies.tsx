import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Users, Building, Phone, Mail, MapPin, Plus, Eye, DollarSign, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useCompanies } from "@/hooks/useCompanies";
import { useTickets } from "@/hooks/useTickets";

const Companies = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { companies, loading: companiesLoading } = useCompanies();
  const { tickets, loading: ticketsLoading } = useTickets();

  // Calculate ticket counts for each company
  const companiesWithStats = useMemo(() => {
    return companies.map(company => {
      const companyTickets = tickets.filter(ticket => ticket.company_id === company.id);
      const activeTickets = companyTickets.filter(ticket => 
        ticket.status !== 'resolved' && ticket.status !== 'closed'
      ).length;
      const totalTickets = companyTickets.length;

      return {
        ...company,
        activeTickets,
        totalTickets,
        contact: company.contact_email || 'No contact',
        phone: company.contact_phone || 'No phone',
        email: company.contact_email || 'No email',
        address: company.address || 'No address',
      };
    });
  }, [companies, tickets]);

  const filteredCompanies = companiesWithStats.filter(company =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.contact.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (activeTickets: number) => {
    if (activeTickets > 2) return "destructive";
    if (activeTickets > 0) return "default";
    return "secondary";
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Companies</h1>
              <p className="text-muted-foreground">Manage client companies and contacts</p>
            </div>
            <div className="flex gap-2">
              <Link to="/">
                <Button variant="outline">Dashboard</Button>
              </Link>
              <Link to="/companies/new">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Company
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Search */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Search Companies</CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              placeholder="Search companies or contacts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md"
            />
          </CardContent>
        </Card>

        {/* Loading State */}
        {(companiesLoading || ticketsLoading) && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Loading companies...</span>
          </div>
        )}

        {/* Companies Grid */}
        {!companiesLoading && !ticketsLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCompanies.map((company) => (
            <Card key={company.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Building className="h-5 w-5 text-muted-foreground" />
                    <CardTitle className="text-lg">{company.name}</CardTitle>
                  </div>
                  <Badge variant={getStatusColor(company.activeTickets)}>
                    {company.activeTickets} active
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>{company.contact}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{company.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{company.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{company.address}</span>
                  </div>
                   
                   <div className="pt-3 border-t">
                     <div className="flex justify-between text-sm text-muted-foreground mb-3">
                       <span>Total tickets: {company.totalTickets}</span>
                       <span>Active: {company.activeTickets}</span>
                     </div>
                     <div className="flex gap-2">
                       <Link to={`/companies/${company.id}`} className="flex-1">
                         <Button variant="outline" size="sm" className="w-full">
                           <Eye className="h-3 w-3 mr-1" />
                           View Details
                         </Button>
                       </Link>
                       <Link to={`/new-ticket?company=${company.name}`} className="flex-1">
                         <Button size="sm" className="w-full">
                           New Ticket
                         </Button>
                       </Link>
                     </div>
                   </div>
                 </div>
               </CardContent>
             </Card>
             ))}
           </div>
        )}

        {!companiesLoading && !ticketsLoading && filteredCompanies.length === 0 && (
          <Card>
            <CardContent className="text-center py-8">
              <Building className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No companies found</h3>
              <p className="text-muted-foreground">Try adjusting your search or add a new company.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Companies;