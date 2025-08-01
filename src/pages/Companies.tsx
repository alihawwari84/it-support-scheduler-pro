import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Users, Building, Phone, Mail, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

const Companies = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const companies = [
    {
      id: 1,
      name: "UCS",
      contact: "Ahmed Al-Rashid",
      phone: "+971-50-123-4567",
      email: "contact@ucs.ae",
      address: "Dubai Marina, Dubai",
      activeTickets: 3,
      totalTickets: 15,
      status: "active"
    },
    {
      id: 2,
      name: "EMCC",
      contact: "Sarah Johnson",
      phone: "+971-55-987-6543",
      email: "info@emcc.ae",
      address: "DIFC, Dubai",
      activeTickets: 1,
      totalTickets: 8,
      status: "active"
    },
    {
      id: 3,
      name: "Praxis",
      contact: "Mohamed Hassan",
      phone: "+971-52-456-7890",
      email: "support@praxis.ae",
      address: "Business Bay, Dubai",
      activeTickets: 2,
      totalTickets: 12,
      status: "active"
    },
    {
      id: 4,
      name: "Flucon",
      contact: "Lisa Chen",
      phone: "+971-58-321-9876",
      email: "hello@flucon.ae",
      address: "JLT, Dubai",
      activeTickets: 0,
      totalTickets: 5,
      status: "active"
    },
    {
      id: 5,
      name: "Dudin",
      contact: "Omar Al-Mansouri",
      phone: "+971-56-654-3210",
      email: "contact@dudin.ae",
      address: "Downtown Dubai",
      activeTickets: 1,
      totalTickets: 7,
      status: "active"
    },
    {
      id: 6,
      name: "FNCS",
      contact: "Jennifer Smith",
      phone: "+971-54-789-0123",
      email: "info@fncs.ae",
      address: "Sheikh Zayed Road, Dubai",
      activeTickets: 2,
      totalTickets: 10,
      status: "active"
    },
    {
      id: 7,
      name: "Exclusive",
      contact: "Khalid Al-Zaabi",
      phone: "+971-50-234-5678",
      email: "support@exclusive.ae",
      address: "Al Barsha, Dubai",
      activeTickets: 0,
      totalTickets: 3,
      status: "active"
    },
    {
      id: 8,
      name: "Injaz",
      contact: "Fatima Al-Qasimi",
      phone: "+971-55-876-5432",
      email: "contact@injaz.ae",
      address: "Deira, Dubai",
      activeTickets: 1,
      totalTickets: 6,
      status: "active"
    }
  ];

  const filteredCompanies = companies.filter(company =>
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
              <Button>Add Company</Button>
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

        {/* Companies Grid */}
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
                      <Button variant="outline" size="sm" className="flex-1">
                        View Details
                      </Button>
                      <Button size="sm" className="flex-1">
                        New Ticket
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredCompanies.length === 0 && (
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