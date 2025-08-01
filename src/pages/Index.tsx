
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, Calendar, FileText, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useTickets } from "@/hooks/useTickets";
import { useCompanies } from "@/hooks/useCompanies";

const Index = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const { tickets, loading: ticketsLoading } = useTickets();
  const { companies, loading: companiesLoading } = useCompanies();

  // Calculate real stats from Supabase data
  const stats = useMemo(() => {
    const pendingTickets = tickets.filter(t => t.status === 'open' || t.status === 'in_progress').length;
    const todayTasks = tickets.filter(t => {
      const today = new Date().toDateString();
      return t.due_date && new Date(t.due_date).toDateString() === today;
    }).length;
    const activeCompanies = companies.length;
    const weeklyResolved = tickets.filter(t => {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return t.status === 'resolved' && t.resolved_at && new Date(t.resolved_at) >= weekAgo;
    }).length;

    return { pendingTickets, todayTasks, activeCompanies, weeklyResolved };
  }, [tickets, companies]);

  const upcomingTasks = [
    { id: 1, company: "Praxis", task: "On-site visit", time: "5:00 PM", priority: "high" },
    { id: 2, company: "Injaz", task: "Full-time shift", time: "9:00 AM", priority: "medium" },
    { id: 3, company: "Exclusive", task: "On-site visit", time: "Sunday", priority: "high" },
  ];

  const recentTickets = [
    { id: 1, company: "UCS", issue: "Network connectivity", status: "pending", priority: "high" },
    { id: 2, company: "EMCC", issue: "Email setup", status: "in-progress", priority: "medium" },
    { id: 3, company: "Flucon", issue: "Software installation", status: "resolved", priority: "low" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">IT Support Scheduler Pro</h1>
              <p className="text-muted-foreground">Managing support for 8 companies</p>
            </div>
            <div className="flex gap-2">
              <Link to="/tickets">
                <Button variant="outline">View All Tickets</Button>
              </Link>
              <Link to="/schedule">
                <Button>Manage Schedule</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Tickets</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">{stats.pendingTickets}</div>
              <p className="text-xs text-muted-foreground">Require attention</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's Tasks</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{stats.todayTasks}</div>
              <p className="text-xs text-muted-foreground">Scheduled for today</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Companies</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeCompanies}</div>
              <p className="text-xs text-muted-foreground">Currently servicing</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Weekly Resolved</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.weeklyResolved}</div>
              <p className="text-xs text-muted-foreground">This week</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upcoming Tasks */}
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Tasks</CardTitle>
              <CardDescription>Your schedule for today and this week</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {upcomingTasks.map((task) => (
                <div key={task.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <div className="font-medium">{task.company}</div>
                    <div className="text-sm text-muted-foreground">{task.task}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">{task.time}</div>
                    <Badge variant={task.priority === "high" ? "destructive" : "secondary"}>
                      {task.priority}
                    </Badge>
                  </div>
                </div>
              ))}
              <Link to="/schedule">
                <Button variant="outline" className="w-full">View Full Schedule</Button>
              </Link>
            </CardContent>
          </Card>

          {/* Recent Tickets */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Tickets</CardTitle>
              <CardDescription>Latest support requests across all companies</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentTickets.map((ticket) => (
                <div key={ticket.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <div className="font-medium">{ticket.company}</div>
                    <div className="text-sm text-muted-foreground">{ticket.issue}</div>
                  </div>
                  <div className="text-right">
                    <Badge 
                      variant={
                        ticket.status === "resolved" ? "default" : 
                        ticket.status === "in-progress" ? "secondary" : "destructive"
                      }
                    >
                      {ticket.status}
                    </Badge>
                    <div className="text-xs text-muted-foreground mt-1">
                      {ticket.priority} priority
                    </div>
                  </div>
                </div>
              ))}
              <Link to="/tickets">
                <Button variant="outline" className="w-full">View All Tickets</Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link to="/tickets/new">
                <Button variant="outline" className="w-full h-20 flex flex-col">
                  <FileText className="h-6 w-6 mb-2" />
                  New Ticket
                </Button>
              </Link>
              <Link to="/schedule">
                <Button variant="outline" className="w-full h-20 flex flex-col">
                  <Calendar className="h-6 w-6 mb-2" />
                  Schedule
                </Button>
              </Link>
              <Link to="/companies">
                <Button variant="outline" className="w-full h-20 flex flex-col">
                  <Users className="h-6 w-6 mb-2" />
                  Companies
                </Button>
              </Link>
              <Link to="/reports">
                <Button variant="outline" className="w-full h-20 flex flex-col">
                  <FileText className="h-6 w-6 mb-2" />
                  Reports
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
