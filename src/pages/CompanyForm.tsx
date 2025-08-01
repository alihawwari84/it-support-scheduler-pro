import { useState, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Building, DollarSign, Clock, Calculator } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface Company {
  id: number;
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

const CompanyForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  
  const isEditing = Boolean(id);
  const prefilledName = searchParams.get('name') || '';
  
  const [formData, setFormData] = useState<Partial<Company>>({
    name: prefilledName,
    contact: "",
    phone: "",
    email: "",
    address: "",
    notes: "",
    salary: 0,
    hoursPerMonth: 0, // Will be calculated from tickets
    activeTickets: 0,
    totalTickets: 0,
    status: "active"
  });

  const [calculatedHours, setCalculatedHours] = useState<number>(0);

  const [costImpact, setCostImpact] = useState<number>(0);

  // Calculate hours per month from actual tickets
  const calculateHoursFromTickets = (companyName: string) => {
    const tickets = JSON.parse(localStorage.getItem('tickets') || '[]');
    const companyTickets = tickets.filter((ticket: any) => ticket.company === companyName);
    
    // Convert estimated time to hours and sum them up
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

    // Calculate average per month (assuming tickets are spread over time)
    // For now, we'll use total hours as monthly estimate
    return Math.round(totalHours * 100) / 100;
  };

  // Calculate cost impact: Monthly salary ÷ Monthly hours = Cost per hour
  useEffect(() => {
    if (formData.salary && calculatedHours > 0) {
      // Cost Impact = Salary ÷ Hours (cost per hour)
      const calculatedCostImpact = formData.salary / calculatedHours;
      setCostImpact(calculatedCostImpact);
    } else {
      setCostImpact(0);
    }
  }, [formData.salary, calculatedHours]);

  // Update calculated hours when company name changes
  useEffect(() => {
    if (formData.name) {
      const hours = calculateHoursFromTickets(formData.name);
      setCalculatedHours(hours);
      setFormData(prev => ({ ...prev, hoursPerMonth: hours }));
    }
  }, [formData.name]);

  // Load existing company data if editing
  useEffect(() => {
    if (isEditing && id) {
      const companies = JSON.parse(localStorage.getItem('companies') || '[]');
      const company = companies.find((c: Company) => c.id === parseInt(id));
      if (company) {
        setFormData(company);
        // Recalculate hours from tickets for existing company
        const hours = calculateHoursFromTickets(company.name);
        setCalculatedHours(hours);
        setFormData(prev => ({ ...prev, hoursPerMonth: hours }));
      }
    }
  }, [isEditing, id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.contact || !formData.email) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields (Name, Contact, Email).",
        variant: "destructive",
      });
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    const companies = JSON.parse(localStorage.getItem('companies') || '[]');
    
    if (isEditing) {
      // Update existing company
      const updatedCompanies = companies.map((company: Company) =>
        company.id === parseInt(id!)
          ? { ...company, ...formData, costImpact }
          : company
      );
      localStorage.setItem('companies', JSON.stringify(updatedCompanies));
      
      toast({
        title: "Company Updated",
        description: `${formData.name} has been updated successfully.`,
      });
    } else {
      // Create new company
      const newCompany: Company = {
        id: Date.now(),
        name: formData.name!,
        contact: formData.contact!,
        phone: formData.phone || "",
        email: formData.email!,
        address: formData.address || "",
        activeTickets: 0,
        totalTickets: 0,
        status: "active",
        notes: formData.notes || "",
        salary: formData.salary || 0,
        hoursPerMonth: calculatedHours,
        costImpact
      };

      const updatedCompanies = [newCompany, ...companies];
      localStorage.setItem('companies', JSON.stringify(updatedCompanies));
      
      toast({
        title: "Company Added",
        description: `${formData.name} has been added successfully.`,
      });
    }

    navigate("/companies");
  };

  const handleInputChange = (field: keyof Company, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
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
              <h1 className="text-2xl font-bold text-foreground">
                {isEditing ? 'Edit Company' : 'Add New Company'}
              </h1>
              <p className="text-muted-foreground">
                {isEditing ? 'Update company information' : 'Add a new client company to the system'}
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Company Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Company Name *</Label>
                  <Input
                    id="name"
                    placeholder="Enter company name"
                    value={formData.name || ""}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact">Contact Person *</Label>
                  <Input
                    id="contact"
                    placeholder="Primary contact name"
                    value={formData.contact || ""}
                    onChange={(e) => handleInputChange("contact", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    placeholder="+971-XX-XXX-XXXX"
                    value={formData.phone || ""}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="contact@company.com"
                    value={formData.email || ""}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                  />
                </div>
              </div>

              {/* Address */}
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  placeholder="Company address"
                  value={formData.address || ""}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                />
              </div>

              {/* Financial Information */}
              <div className="border rounded-lg p-6 space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Financial Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="salary">Company Salary (per month) - AED</Label>
                    <Input
                      id="salary"
                      type="number"
                      placeholder="0"
                      min="0"
                      step="0.01"
                      value={formData.salary || ""}
                      onChange={(e) => handleInputChange("salary", parseFloat(e.target.value) || 0)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="hoursPerMonth">Hours Per Month (Calculated from Tickets)</Label>
                    <div className="relative">
                      <Input
                        id="hoursPerMonth"
                        type="number"
                        value={calculatedHours}
                        disabled
                        className="bg-muted cursor-not-allowed"
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Automatically calculated from ticket estimated times
                    </div>
                  </div>
                </div>

                {/* Cost Impact Display */}
                {costImpact > 0 && (
                  <Card className="bg-muted/50">
                    <CardContent className="pt-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                        <Calculator className="h-4 w-4" />
                        Calculated Cost Impact
                      </div>
                      <div className="text-2xl font-bold text-primary">
                        AED {costImpact.toLocaleString('en-AE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} /hour
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        Cost Impact: AED {formData.salary || 0} ÷ {calculatedHours} hours
                      </div>
                      <div className="text-xs text-muted-foreground mt-2 p-2 bg-blue-50 rounded">
                        ℹ️ Cost Impact = Monthly Salary ÷ Monthly Hours from Tickets
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Notes Section */}
              <div className="space-y-2">
                <Label htmlFor="notes">Internal Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Add any relevant notes, security protocols, access details, or other important information about this company..."
                  value={formData.notes || ""}
                  onChange={(e) => handleInputChange("notes", e.target.value)}
                  rows={6}
                  maxLength={5000}
                  className="resize-y"
                />
                <div className="text-sm text-muted-foreground">
                  {(formData.notes || "").length}/5000 characters
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-3 pt-4">
                <Button type="submit" className="flex-1">
                  {isEditing ? 'Update Company' : 'Add Company'}
                </Button>
                <Link to="/companies">
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CompanyForm;