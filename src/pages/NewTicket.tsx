
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const NewTicket = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    company: "",
    title: "",
    description: "",
    priority: "",
    type: "",
    estimatedTime: ""
  });

  const companies = ["UCS", "EMCC", "Praxis", "Flucon", "Dudin", "FNCS", "Exclusive", "Injaz"];
  const priorities = ["low", "medium", "high"];
  const types = ["Network", "Email", "Software", "Hardware", "Maintenance", "Setup"];
  const timeEstimates = ["30 minutes", "1 hour", "1.5 hours", "2 hours", "3 hours", "Half day", "Full day"];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.company || !formData.title || !formData.description || !formData.priority || !formData.type) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    // Here you would typically save to a database
    console.log("New ticket created:", formData);
    
    toast({
      title: "Ticket Created",
      description: `Support ticket for ${formData.company} has been created successfully.`,
    });

    // Navigate back to tickets page
    navigate("/tickets");
  };

  const handleInputChange = (field: string, value: string) => {
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
            <Link to="/tickets">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Tickets
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Create New Ticket</h1>
              <p className="text-muted-foreground">Submit a new IT support request</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>New Support Ticket</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Company Selection */}
              <div className="space-y-2">
                <Label htmlFor="company">Company *</Label>
                <Select value={formData.company} onValueChange={(value) => handleInputChange("company", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select company" />
                  </SelectTrigger>
                  <SelectContent>
                    {companies.map(company => (
                      <SelectItem key={company} value={company}>{company}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Issue Title *</Label>
                <Input
                  id="title"
                  placeholder="Brief description of the issue"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Detailed description of the issue and any error messages"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  rows={4}
                />
              </div>

              {/* Priority and Type */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority *</Label>
                  <Select value={formData.priority} onValueChange={(value) => handleInputChange("priority", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      {priorities.map(priority => (
                        <SelectItem key={priority} value={priority}>
                          {priority.charAt(0).toUpperCase() + priority.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Issue Type *</Label>
                  <Select value={formData.type} onValueChange={(value) => handleInputChange("type", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {types.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Estimated Time */}
              <div className="space-y-2">
                <Label htmlFor="estimatedTime">Estimated Time</Label>
                <Select value={formData.estimatedTime} onValueChange={(value) => handleInputChange("estimatedTime", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select estimated time" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeEstimates.map(time => (
                      <SelectItem key={time} value={time}>{time}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Submit Button */}
              <div className="flex gap-3 pt-4">
                <Button type="submit" className="flex-1">
                  Create Ticket
                </Button>
                <Link to="/tickets">
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

export default NewTicket;
