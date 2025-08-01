import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { Calendar, Download, TrendingUp, Clock, Users, FileText } from "lucide-react";
import { Link } from "react-router-dom";

const Reports = () => {
  const [timeRange, setTimeRange] = useState("last-30-days");

  // Mock data for charts
  const ticketsByCompany = [
    { name: "UCS", tickets: 15, resolved: 12, pending: 3 },
    { name: "EMCC", tickets: 8, resolved: 7, pending: 1 },
    { name: "Praxis", tickets: 12, resolved: 10, pending: 2 },
    { name: "Flucon", tickets: 5, resolved: 5, pending: 0 },
    { name: "Dudin", tickets: 7, resolved: 6, pending: 1 },
    { name: "FNCS", tickets: 10, resolved: 8, pending: 2 },
    { name: "Exclusive", tickets: 3, resolved: 3, pending: 0 },
    { name: "Injaz", tickets: 6, resolved: 5, pending: 1 }
  ];

  const ticketsByType = [
    { name: "Network", value: 25, color: "#8884d8" },
    { name: "Email", value: 20, color: "#82ca9d" },
    { name: "Software", value: 18, color: "#ffc658" },
    { name: "Hardware", value: 15, color: "#ff7300" },
    { name: "Security", value: 12, color: "#00ff00" },
    { name: "Other", value: 10, color: "#ff0000" }
  ];

  const ticketsTrend = [
    { date: "Week 1", created: 12, resolved: 8 },
    { date: "Week 2", created: 15, resolved: 13 },
    { date: "Week 3", created: 18, resolved: 16 },
    { date: "Week 4", created: 14, resolved: 15 },
    { date: "Week 5", created: 16, resolved: 14 }
  ];

  const stats = {
    totalTickets: 66,
    resolvedTickets: 56,
    pendingTickets: 10,
    avgResolutionTime: "2.5 hours",
    satisfaction: "94%"
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Reports & Analytics</h1>
              <p className="text-muted-foreground">Track performance and analyze ticket trends</p>
            </div>
            <div className="flex gap-2">
              <Link to="/">
                <Button variant="outline">Dashboard</Button>
              </Link>
              <Button>
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Time Range Filter */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Report Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <label className="text-sm font-medium">Time Range:</label>
              </div>
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="last-7-days">Last 7 days</SelectItem>
                  <SelectItem value="last-30-days">Last 30 days</SelectItem>
                  <SelectItem value="last-90-days">Last 90 days</SelectItem>
                  <SelectItem value="last-year">Last year</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <FileText className="h-8 w-8 text-muted-foreground" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Total Tickets</p>
                  <p className="text-2xl font-bold">{stats.totalTickets}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Resolved</p>
                  <p className="text-2xl font-bold">{stats.resolvedTickets}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-yellow-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Pending</p>
                  <p className="text-2xl font-bold">{stats.pendingTickets}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Avg Resolution</p>
                  <p className="text-2xl font-bold">{stats.avgResolutionTime}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Satisfaction</p>
                  <p className="text-2xl font-bold">{stats.satisfaction}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Data Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Tickets by Company */}
          <Card>
            <CardHeader>
              <CardTitle>Tickets by Company</CardTitle>
              <CardDescription>Total and pending tickets per company</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {ticketsByCompany.map((company) => (
                  <div key={company.name} className="flex items-center justify-between p-3 border rounded">
                    <div className="flex items-center gap-3">
                      <div className="font-medium">{company.name}</div>
                      <Badge variant="outline">{company.tickets} total</Badge>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant="secondary">{company.resolved} resolved</Badge>
                      <Badge variant={company.pending > 0 ? "destructive" : "outline"}>
                        {company.pending} pending
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Tickets by Type */}
          <Card>
            <CardHeader>
              <CardTitle>Tickets by Type</CardTitle>
              <CardDescription>Distribution of ticket categories</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {ticketsByType.map((type) => (
                  <div key={type.name} className="flex items-center justify-between p-3 border rounded">
                    <div className="font-medium">{type.name}</div>
                    <Badge variant="outline">{type.value} tickets</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Reports;