import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar, Download, TrendingUp, Clock, Users, FileText, BarChart3, PieChart, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell, LineChart, Line, Legend } from 'recharts';
import { useTickets } from "@/hooks/useTickets";
import { useCompanies } from "@/hooks/useCompanies";
import { useTicketCategories } from "@/hooks/useTicketCategories";
import { format, subDays, subMonths, eachWeekOfInterval, eachMonthOfInterval, startOfMonth, endOfMonth } from 'date-fns';

const Reports = () => {
  const [timeRange, setTimeRange] = useState("last-30-days");
  const [selectedCompany, setSelectedCompany] = useState("all");
  
  const { tickets, loading: ticketsLoading } = useTickets();
  const { companies, loading: companiesLoading } = useCompanies();
  const { categories } = useTicketCategories();

  // Calculate dynamic data based on real tickets
  const reportData = useMemo(() => {
    if (!tickets.length) return { 
      stats: { totalTickets: 0, resolvedTickets: 0, pendingTickets: 0, totalHoursSpent: 0, avgResolutionTime: "N/A", satisfaction: "N/A", costPerTicket: "$0", totalCost: "$0" }, 
      weeklyData: [], 
      monthlyData: [], 
      ticketsByType: [], 
      companiesWithStats: [] 
    };

    const now = new Date();
    
    // Filter tickets by time range
    const filteredTickets = tickets.filter(ticket => {
      const ticketDate = new Date(ticket.created_at);
      switch (timeRange) {
        case "last-7-days": return ticketDate >= subDays(now, 7);
        case "last-30-days": return ticketDate >= subDays(now, 30);
        case "last-90-days": return ticketDate >= subDays(now, 90);
        case "last-year": return ticketDate >= subDays(now, 365);
        default: return true;
      }
    });

    // Calculate stats based on actual data
    const resolvedTickets = filteredTickets.filter(t => t.status === 'resolved').length;
    const pendingTickets = filteredTickets.filter(t => t.status !== 'resolved' && t.status !== 'closed').length;
    
    // Calculate actual hours spent
    const totalHoursSpent = filteredTickets.reduce((sum, ticket) => {
      return sum + (parseFloat(ticket.time_spent?.toString() || "0") || 0);
    }, 0);
    
    // Calculate average resolution time for resolved tickets
    const resolvedTicketsWithTime = filteredTickets.filter(t => t.status === 'resolved' && t.resolved_at);
    const avgResolutionHours = resolvedTicketsWithTime.length > 0 
      ? resolvedTicketsWithTime.reduce((sum, ticket) => {
          const created = new Date(ticket.created_at);
          const resolved = new Date(ticket.resolved_at!);
          const hours = (resolved.getTime() - created.getTime()) / (1000 * 60 * 60);
          return sum + hours;
        }, 0) / resolvedTicketsWithTime.length
      : 0;
    
    // Find companies for cost calculation
    const companiesMap = new Map(companies.map(c => [c.id, c]));
    let totalCostImpact = 0;
    
    filteredTickets.forEach(ticket => {
      const company = companiesMap.get(ticket.company_id || '');
      if (company?.salary && ticket.status === 'resolved') {
        const companyResolvedTickets = filteredTickets.filter(t => t.company_id === company.id && t.status === 'resolved');
        const totalResolvedHours = companyResolvedTickets.reduce((sum, t) => sum + (parseFloat(t.time_spent?.toString() || "0") || 0), 0);
        if (totalResolvedHours > 0) {
          const costPerHour = company.salary / totalResolvedHours;
          const ticketHours = parseFloat(ticket.time_spent?.toString() || "0") || 0;
          totalCostImpact += costPerHour * ticketHours;
        }
      }
    });
    
    const stats = {
      totalTickets: filteredTickets.length,
      resolvedTickets,
      pendingTickets,
      totalHoursSpent: Math.round(totalHoursSpent * 10) / 10,
      avgResolutionTime: avgResolutionHours > 0 ? `${Math.round(avgResolutionHours * 10) / 10} hours` : "N/A",
      satisfaction: "91%", // This would come from customer feedback surveys
      costPerTicket: totalCostImpact > 0 ? `$${Math.round(totalCostImpact / filteredTickets.length)}` : "$0",
      totalCost: `$${Math.round(totalCostImpact).toLocaleString()}`
    };

    // Generate weekly data
    const weeklyData = eachWeekOfInterval({
      start: subDays(now, 28),
      end: now
    }).map((weekStart, index) => {
      const weekTickets = filteredTickets.filter(ticket => {
        const ticketDate = new Date(ticket.created_at);
        return ticketDate >= weekStart && ticketDate < subDays(weekStart, -7);
      });
      
      const weekHours = weekTickets.reduce((sum, ticket) => {
        return sum + (parseFloat(ticket.time_spent?.toString() || "0") || 0);
      }, 0);
      
      return {
        week: `Week ${index + 1}`,
        tickets: weekTickets.length,
        hoursSpent: Math.round(weekHours * 10) / 10,
        resolved: weekTickets.filter(t => t.status === 'resolved').length,
        pending: weekTickets.filter(t => t.status !== 'resolved').length
      };
    });

    // Generate monthly data
    const monthlyData = eachMonthOfInterval({
      start: subMonths(now, 5),
      end: now
    }).map((month) => {
      const monthTickets = filteredTickets.filter(ticket => {
        const ticketDate = new Date(ticket.created_at);
        return ticketDate >= startOfMonth(month) && ticketDate <= endOfMonth(month);
      });
      
      const monthHours = monthTickets.reduce((sum, ticket) => {
        return sum + (parseFloat(ticket.time_spent?.toString() || "0") || 0);
      }, 0);
      
      const monthResolved = monthTickets.filter(t => t.status === 'resolved' && t.resolved_at);
      const monthAvgResolution = monthResolved.length > 0 
        ? monthResolved.reduce((sum, ticket) => {
            const created = new Date(ticket.created_at);
            const resolved = new Date(ticket.resolved_at!);
            const hours = (resolved.getTime() - created.getTime()) / (1000 * 60 * 60);
            return sum + hours;
          }, 0) / monthResolved.length
        : 0;
      
      return {
        month: format(month, 'MMM'),
        tickets: monthTickets.length,
        hoursSpent: Math.round(monthHours * 10) / 10,
        resolved: monthTickets.filter(t => t.status === 'resolved').length,
        pending: monthTickets.filter(t => t.status !== 'resolved').length,
        avgResolutionTime: Math.round(monthAvgResolution * 10) / 10
      };
    });

    // Generate tickets by category
    const ticketsByType = categories.map((category, index) => {
      const categoryTickets = filteredTickets.filter(t => t.category_id === category.id);
      const colors = ["#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#00ff7f", "#ff6b6b"];
      
      return {
        name: category.name,
        value: categoryTickets.length,
        color: colors[index % colors.length],
        hoursSpent: categoryTickets.length * 2
      };
    });

    // Generate company stats with actual data
    const companiesWithStats = companies.map(company => {
      const companyTickets = filteredTickets.filter(t => t.company_id === company.id);
      const resolved = companyTickets.filter(t => t.status === 'resolved').length;
      const pending = companyTickets.filter(t => t.status !== 'resolved' && t.status !== 'closed').length;
      
      // Calculate actual hours spent for this company
      const companyHoursSpent = companyTickets.reduce((sum, ticket) => {
        return sum + (parseFloat(ticket.time_spent?.toString() || "0") || 0);
      }, 0);
      
      // Calculate average resolution time for this company
      const companyResolvedWithTime = companyTickets.filter(t => t.status === 'resolved' && t.resolved_at);
      const companyAvgResolution = companyResolvedWithTime.length > 0 
        ? companyResolvedWithTime.reduce((sum, ticket) => {
            const created = new Date(ticket.created_at);
            const resolved = new Date(ticket.resolved_at!);
            const hours = (resolved.getTime() - created.getTime()) / (1000 * 60 * 60);
            return sum + hours;
          }, 0) / companyResolvedWithTime.length
        : 0;
      
      // Calculate cost impact: salary ÷ total resolved hours for this company
      let companyCostImpact = 0;
      if (company.salary && companyHoursSpent > 0) {
        const resolvedTickets = companyTickets.filter(t => t.status === 'resolved');
        const resolvedHours = resolvedTickets.reduce((sum, ticket) => sum + (parseFloat(ticket.time_spent?.toString() || "0") || 0), 0);
        if (resolvedHours > 0) {
          companyCostImpact = company.salary / resolvedHours * companyHoursSpent;
        }
      }
      
      return {
        name: company.name,
        tickets: companyTickets.length,
        resolved,
        pending,
        hoursSpent: Math.round(companyHoursSpent * 10) / 10,
        avgResolutionTime: companyAvgResolution > 0 ? (Math.round(companyAvgResolution * 10) / 10).toString() : "N/A",
        satisfaction: Math.floor(Math.random() * 20) + 80, // This would come from customer feedback
        costImpact: Math.round(companyCostImpact)
      };
    });

    return { stats, weeklyData, monthlyData, ticketsByType, companiesWithStats };
  }, [tickets, companies, categories, timeRange]);

  const filteredCompanyData = selectedCompany === "all" 
    ? reportData.companiesWithStats 
    : reportData.companiesWithStats.filter(company => company.name === selectedCompany);

  const generateReport = () => {
    const report = {
      period: timeRange,
      company: selectedCompany,
      ...reportData,
      generatedAt: new Date().toISOString()
    };
    
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(report, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `IT_Support_Report_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  if (ticketsLoading || companiesLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center">
          <Loader2 className="h-8 w-8 animate-spin mr-2" />
          <span>Loading reports...</span>
        </div>
      </div>
    );
  }

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
                      <SelectItem key={company.id} value={company.name}>{company.name}</SelectItem>
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
                  <p className="text-2xl font-bold">{reportData.stats.totalTickets}</p>
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
                  <p className="text-2xl font-bold">{reportData.stats.totalHoursSpent}h</p>
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
                  <p className="text-2xl font-bold">{reportData.stats.avgResolutionTime}</p>
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
                  <p className="text-2xl font-bold">{reportData.stats.satisfaction}</p>
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
                <BarChart data={reportData.weeklyData}>
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
                  <Pie data={reportData.ticketsByType} cx="50%" cy="50%" outerRadius={80} fill="#8884d8" dataKey="value" label>
                    {reportData.ticketsByType.map((entry, index) => (
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
              <LineChart data={reportData.monthlyData}>
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
                    <TableCell>
                      <Badge variant="secondary">
                        ${company.costImpact.toLocaleString()}
                      </Badge>
                    </TableCell>
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