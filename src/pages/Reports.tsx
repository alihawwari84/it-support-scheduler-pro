
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar, Download, TrendingUp, Clock, Users, FileText, BarChart3, PieChart } from "lucide-react";
import { Link } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell, LineChart, Line, Legend } from 'recharts';

const Reports = () => {
  const [timeRange, setTimeRange] = useState("last-30-days");
  const [selectedCompany, setSelectedCompany] = useState("all");

  const companies = ["UCS", "EMCC", "Praxis", "Flucon", "Dudin", "FNCS", "Exclusive", "Injaz"];

  // Mock data for comprehensive reporting
  const weeklyData = [
    { week: "Week 1", tickets: 12, hoursSpent: 28, resolved: 8, pending: 4 },
    { week: "Week 2", tickets: 15, hoursSpent: 35, resolved: 13, pending: 2 },
    { week: "Week 3", tickets: 18, hoursSpent: 42, resolved: 16, pending: 2 },
    { week: "Week 4", tickets: 14, hoursSpent: 32, resolved: 12, pending: 2 }
  ];

  const monthlyData = [
    { month: "January", tickets: 45, hoursSpent: 98, resolved: 40, pending: 5, avgResolutionTime: 2.2 },
    { month: "February", tickets: 52, hoursSpent: 115, resolved: 48, pending: 4, avgResolutionTime: 2.4 },
    { month: "March", tickets: 38, hoursSpent: 82, resolved: 35, pending: 3, avgResolutionTime: 2.1 },
    { month: "April", tickets: 59, hoursSpent: 137, resolved: 54, pending: 5, avgResolutionTime: 2.8 }
  ];

  const ticketsByCompany = [
    { name: "UCS", tickets: 15, resolved: 12, pending: 3, hoursSpent: 38, avgResolutionTime: 2.5, satisfaction: 92 },
    { name: "EMCC", tickets: 8, resolved: 7, pending: 1, hoursSpent: 18, avgResolutionTime: 2.1, satisfaction: 95 },
    { name: "Praxis", tickets: 12, resolved: 10, pending: 2, hoursSpent: 28, avgResolutionTime: 2.3, satisfaction: 88 },
    { name: "Flucon", tickets: 5, resolved: 5, pending: 0, hoursSpent: 12, avgResolutionTime: 2.4, satisfaction: 100 },
    { name: "Dudin", tickets: 7, resolved: 6, pending: 1, hoursSpent: 16, avgResolutionTime: 2.2, satisfaction: 90 },
    { name: "FNCS", tickets: 10, resolved: 8, pending: 2, hoursSpent: 24, avgResolutionTime: 2.6, satisfaction: 85 },
    { name: "Exclusive", tickets: 3, resolved: 3, pending: 0, hoursSpent: 7, avgResolutionTime: 2.0, satisfaction: 100 },
    { name: "Injaz", tickets: 6, resolved: 5, pending: 1, hoursSpent: 14, avgResolutionTime: 2.4, satisfaction: 94 }
  ];

  const ticketsByType = [
    { name: "Network", value: 25, color: "#8884d8", hoursSpent: 68 },
    { name: "Email", value: 20, color: "#82ca9d", hoursSpent: 42 },
    { name: "Software", value: 18, color: "#ffc658", hoursSpent: 51 },
    { name: "Hardware", value: 15, color: "#ff7300", hoursSpent: 38 },
    { name: "Security", value: 12, color: "#00ff7f", hoursSpent: 35 },
    { name: "Other", value: 10, color: "#ff6b6b", hoursSpent: 23 }
  ];

  const stats = {
    totalTickets: 66,
    resolvedTickets: 56,
    pendingTickets: 10,
    totalHoursSpent: 157,
    avgResolutionTime: "2.4 hours",
    satisfaction: "91%",
    costPerTicket: "$45",
    totalCost: "$2,970"
  };

  const filteredCompanyData = selectedCompany === "all" 
    ? ticketsByCompany 
    : ticketsByCompany.filter(company => company.name === selectedCompany);

  const generateReport = () => {
    const reportData = {
      period: timeRange,
      company: selectedCompany,
      stats,
      weeklyData,
      monthlyData,
      companyData: filteredCompanyData,
      ticketsByType,
      generatedAt: new Date().toISOString()
    };
    
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(reportData, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `IT_Support_Report_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Comprehensive Reports</h1>
              <p className="text-muted-foreground">Detailed analytics and insights for stakeholders</p>
            </div>
            <div className="flex gap-2">
              <Link to="/">
                <Button variant="outline">Dashboard</Button>
              </Link>
              <Button onClick={generateReport}>
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Report Settings */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Report Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <label className="text-sm font-medium">Company:</label>
                </div>
                <Select value={selectedCompany} onValueChange={setSelectedCompany}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Companies</SelectItem>
                    {companies.map(company => (
                      <SelectItem key={company} value={company}>{company}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Executive Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <FileText className="h-8 w-8 text-blue-600" />
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
                <Clock className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Hours Spent</p>
                  <p className="text-2xl font-bold">{stats.totalHoursSpent}h</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-purple-600" />
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
                <Users className="h-8 w-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Satisfaction</p>
                  <p className="text-2xl font-bold">{stats.satisfaction}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Weekly Tickets Trend */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Weekly Tickets & Hours
              </CardTitle>
              <CardDescription>Tickets created and hours spent per week</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="tickets" fill="#8884d8" name="Tickets" />
                  <Bar dataKey="hoursSpent" fill="#82ca9d" name="Hours Spent" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Tickets by Type Pie Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5" />
                Tickets by Category
              </CardTitle>
              <CardDescription>Distribution of ticket types</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <RechartsPieChart>
                  <Tooltip />
                  <Pie data={ticketsByType} cx="50%" cy="50%" outerRadius={80} fill="#8884d8" dataKey="value" label>
                    {ticketsByType.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </RechartsPieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Monthly Performance Chart */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Monthly Performance Trends</CardTitle>
            <CardDescription>Monthly tickets, hours, and resolution time analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="tickets" stroke="#8884d8" strokeWidth={2} name="Tickets" />
                <Line type="monotone" dataKey="hoursSpent" stroke="#82ca9d" strokeWidth={2} name="Hours Spent" />
                <Line type="monotone" dataKey="avgResolutionTime" stroke="#ffc658" strokeWidth={2} name="Avg Resolution (hrs)" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Detailed Company Performance Table */}
        <Card>
          <CardHeader>
            <CardTitle>Company Performance Details</CardTitle>
            <CardDescription>Comprehensive metrics per company</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Company</TableHead>
                  <TableHead>Total Tickets</TableHead>
                  <TableHead>Resolved</TableHead>
                  <TableHead>Pending</TableHead>
                  <TableHead>Hours Spent</TableHead>
                  <TableHead>Avg Resolution</TableHead>
                  <TableHead>Satisfaction</TableHead>
                  <TableHead>Cost Impact</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCompanyData.map((company) => (
                  <TableRow key={company.name}>
                    <TableCell className="font-medium">{company.name}</TableCell>
                    <TableCell>{company.tickets}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{company.resolved}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={company.pending > 0 ? "destructive" : "outline"}>
                        {company.pending}
                      </Badge>
                    </TableCell>
                    <TableCell>{company.hoursSpent}h</TableCell>
                    <TableCell>{company.avgResolutionTime}h</TableCell>
                    <TableCell>
                      <Badge variant={company.satisfaction >= 90 ? "secondary" : "outline"}>
                        {company.satisfaction}%
                      </Badge>
                    </TableCell>
                    <TableCell>${company.hoursSpent * 45}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Reports;
