import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Building, 
  Users, 
  Phone, 
  Mail, 
  MapPin, 
  Edit, 
  Plus,
  DollarSign,
  Clock,
  Calculator,
  FileText
} from "lucide-react";

interface Company {
  id: number | string;
  name: string;
  contact: string;
  phone: string;
  email: string;
  address: string;
  activeTickets: number;
  totalTickets: number;
  status: string;
  notes?: string;
  salary?: number;
  hoursPerMonth?: number;
  costImpact?: number;
}

const CompanyDetails = () => {
  const { id } = useParams();
  const [company, setCompany] = useState<Company | null>(null);
  const [calculatedHours, setCalculatedHours] = useState<number>(0);

  const calculateHoursFromTickets = (companyName: string) => {
    const tickets = JSON.parse(localStorage.getItem("tickets") || "[]");
    const companyTickets = tickets.filter((ticket: any) => ticket.company === companyName);

    let totalHours = 0;
    companyTickets.forEach((ticket: any) => {
      const timeStr = ticket.estimatedTime || "";
      if (timeStr.includes("minutes")) {
        totalHours += parseFloat(timeStr) / 60;
      } else if (timeStr.includes("hour")) {
        totalHours += parseFloat(timeStr);
      } else if (timeStr.includes("Half day")) {
        totalHours += 4;
      } else if (timeStr.includes("Full day")) {
        totalHours += 8;
      }
    });

    return Math.round(totalHours * 100) / 100;
  };

  useEffect(() => {
    if (id) {
      const companies = JSON.parse(localStorage.getItem("companies") || "[]");
      const foundCompany = companies.find((c: Company) => String(c.id) === id);
      if (foundCompany) {
        setCompany(foundCompany);
        const hours = calculateHoursFromTickets(foundCompany.name);
        setCalculatedHours(hours);
      }
    }
  }, [id]);

  if (!company) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b bg-card">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center gap-4">
              <Link to="/companies">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Companies
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Company Not Found</h1>
              </div>
            </div>
          </div>
        </header>
        <div className="container mx-auto px-4 py-6">
          <Card>
            <CardContent className="text-center py-8">
              <Building className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Company not found</h3>
              <p className="text-muted-foreground">
                The requested company with ID "{id}" could not be found.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const getStatusColor = (activeTickets: number) => {
    if (activeTickets > 2) return "destructive";
    if (activeTickets > 0) return "default";
    return "secondary";
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/companies">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Companies
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-foreground">{company.name}</h1>
                <p className="text-muted-foreground">Company details and information</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Link to={`/companies/${company.id}/edit`}>
                <Button variant="outline">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Company
                </Button>
              </Link>
              <Link to={`/new-ticket?company=${company.name}`}>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  New Ticket
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Building className="h-5 w-5" />
                    Company Information
                  </CardTitle>
                  <Badge variant={getStatusColor(company.activeTickets)}>
                    {company.activeTickets} active tickets
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Contact:</span>
                      <span>{company.contact}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Phone:</span>
                      <span>{company.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Email:</span>
                      <span>{company.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Address:</span>
                      <span>{company.address}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {(company.salary || calculatedHours || company.costImpact) && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Financial Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {company.salary && (
                      <div className="text-center p-4 bg-muted/50 rounded-lg">
                        <div className="text-2xl font-bold text-primary">
                          JOD {company.salary.toLocaleString("en-JO")}
                        </div>
                        <div className="text-sm text-muted-foreground">Monthly Salary</div>
                      </div>
                    )}

                    {calculatedHours > 0 && (
                      <div className="text-center p-4 bg-muted/50 rounded-lg">
                        <div className="text-2xl font-bold text-primary flex items-center justify-center gap-1">
                          <Clock className="h-5 w-5" />
                          {calculatedHours}
                        </div>
                        <div className="text-sm text-muted-foreground">Hours Per Month</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          From Ticket Estimates
                        </div>
                      </div>
                    )}

                    {company.salary && calculatedHours > 0 && (
                      <div className="text-center p-4 bg-primary/10 rounded-lg border-2 border-primary/20">
                        <div className="text-2xl font-bold text-primary flex items-center justify-center gap-1">
                          <Calculator className="h-5 w-5" />
                          JOD {(company.salary / calculatedHours).toLocaleString("en-JO", {
                            minimumFractionDigits: 2,
                          })}{" "}
                          /hour
                        </div>
                        <div className="text-sm text-muted-foreground">Cost Impact</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          Salary ÷ Hours
                        </div>
                      </div>
                    )}
                  </div>

                  {company.salary && calculatedHours > 0 && (
                    <div className="mt-4 p-4 bg-muted/30 rounded-lg">
                      <div className="text-sm text-muted-foreground">
                        <strong>Cost Impact Calculation:</strong>
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        JOD {company.salary.toLocaleString("en-JO")} ÷ {calculatedHours} hours = JOD{" "}
                        {(company.salary / calculatedHours).toFixed(2)} per hour
                      </div>
                      <div className="text-xs text-muted-foreground mt-2 p-2 bg-blue-50 rounded">
                        💡 Shows the cost per hour based on actual ticket workload
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {company.notes && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Internal Notes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="whitespace-pre-wrap text-sm bg-muted/50 p-4 rounded-lg">
                    {company.notes}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Total Tickets</span>
                    <span className="font-medium">{company.totalTickets}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Active Tickets</span>
                    <Badge variant={getStatusColor(company.activeTickets)}>
                      {company.activeTickets}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Status</span>
                    <Badge variant="secondary">{company.status}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link to={`/tickets?company=${company.name}`} className="w-full">
                  <Button variant="outline" className="w-full">
                    View All Tickets
                  </Button>
                </Link>
                <Link to={`/new-ticket?company=${company.name}`} className="w-full">
                  <Button className="w-full">Create New Ticket</Button>
                </Link>
                <Link to={`/companies/${company.id}/edit`} className="w-full">
                  <Button variant="outline" className="w-full">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Company
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyDetails;
