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
import { useCompanies } from "@/hooks/useCompanies";
import { useTickets } from "@/hooks/useTickets";

interface CompanyFormData {
  name: string;
  contact_email: string;
  contact_phone: string;
  address: string;
}

const CompanyForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const { companies, loading, createCompany, updateCompany } = useCompanies();
  
  const isEditing = Boolean(id);
  const prefilledName = searchParams.get('name') || '';
  
  const [formData, setFormData] = useState<CompanyFormData>({
    name: prefilledName,
    contact_email: "",
    contact_phone: "",
    address: ""
  });

  // Load existing company data if editing
  useEffect(() => {
    if (isEditing && id && companies.length > 0) {
      const company = companies.find(c => c.id === id);
      if (company) {
        setFormData({
          name: company.name,
          contact_email: company.contact_email || "",
          contact_phone: company.contact_phone || "",
          address: company.address || ""
        });
      }
    }
  }, [isEditing, id, companies]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.contact_email) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields (Name, Email).",
        variant: "destructive",
      });
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.contact_email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    try {
      if (isEditing && id) {
        await updateCompany(id, formData);
      } else {
        await createCompany(formData);
      }
      navigate("/companies");
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  const handleInputChange = (field: keyof CompanyFormData, value: string) => {
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
                  <Label htmlFor="contact_phone">Phone Number</Label>
                  <Input
                    id="contact_phone"
                    placeholder="+962-XX-XXX-XXXX"
                    value={formData.contact_phone}
                    onChange={(e) => handleInputChange("contact_phone", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact_email">Email Address *</Label>
                  <Input
                    id="contact_email"
                    type="email"
                    placeholder="contact@company.com"
                    value={formData.contact_email}
                    onChange={(e) => handleInputChange("contact_email", e.target.value)}
                  />
                </div>
              </div>

              {/* Address */}
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  placeholder="Company address"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                />
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