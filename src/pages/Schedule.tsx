
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Users, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useTickets } from "@/hooks/useTickets";
import { useCompanies } from "@/hooks/useCompanies";
import { format, addDays, startOfWeek } from "date-fns";

const Schedule = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { tickets, loading: ticketsLoading } = useTickets();
  const { companies, loading: companiesLoading } = useCompanies();

  // Generate company overview from real data
  const companyOverview = useMemo(() => {
    return companies.map(company => {
      const companyTickets = tickets.filter(t => t.company_id === company.id);
      const activeTickets = companyTickets.filter(t => 
        t.status !== 'resolved' && t.status !== 'closed'
      ).length;
      
      return {
        name: company.name,
        type: activeTickets > 2 ? "High priority support" : "Remote support",
        schedule: activeTickets > 0 ? "Active tickets pending" : "As needed",
        color: getCompanyColor(company.name)
      };
    });
  }, [companies, tickets]);

  // Generate weekly schedule from tickets with due dates
  const weekSchedule = useMemo(() => {
    const startDate = startOfWeek(selectedDate);
    const weekDays = Array.from({ length: 7 }, (_, i) => {
      const date = addDays(startDate, i);
      const dayTickets = tickets.filter(ticket => {
        return ticket.due_date && 
               format(new Date(ticket.due_date), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd');
      });

      return {
        day: format(date, 'EEEE'),
        date: format(date, 'yyyy-MM-dd'),
        tasks: dayTickets.map(ticket => ({
          time: ticket.due_date ? format(new Date(ticket.due_date), 'HH:mm') : 'All day',
          company: ticket.companies?.name || 'Unknown',
          type: ticket.title,
          priority: ticket.priority
        }))
      };
    });

    return weekDays;
  }, [tickets, selectedDate]);

  function getCompanyColor(companyName: string): string {
    const colors = [
      "bg-blue-500", "bg-green-500", "bg-purple-500", "bg-orange-500",
      "bg-pink-500", "bg-cyan-500", "bg-red-500", "bg-indigo-500"
    ];
    const index = companyName.charCodeAt(0) % colors.length;
    return colors[index];
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "destructive";
      case "medium": return "secondary";
      case "low": return "outline";
      default: return "secondary";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Schedule Management</h1>
              <p className="text-muted-foreground">Manage your time across all companies</p>
            </div>
            <div className="flex gap-2">
              <Link to="/">
                <Button variant="outline">Dashboard</Button>
              </Link>
              <Link to="/tickets/new">
                <Button>Add Appointment</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Loading State */}
        {(ticketsLoading || companiesLoading) && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Loading schedule...</span>
          </div>
        )}

        {!ticketsLoading && !companiesLoading && (
          <>
        {/* Company Overview */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Company Schedule Overview</CardTitle>
            <CardDescription>Current status and commitments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {companyOverview.map((company) => (
                <div key={company.name} className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-3 h-3 rounded-full ${company.color}`}></div>
                    <h3 className="font-semibold">{company.name}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">{company.type}</p>
                  <p className="text-sm font-medium">{company.schedule}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Weekly Schedule */}
        <Card>
          <CardHeader>
            <CardTitle>Weekly Schedule</CardTitle>
            <CardDescription>Your upcoming week at a glance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {weekSchedule.map((day) => (
                <div key={day.day} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-lg">{day.day}</h3>
                      <p className="text-sm text-muted-foreground">{day.date}</p>
                    </div>
                    <Badge variant="outline">
                      {day.tasks.length} task{day.tasks.length !== 1 ? 's' : ''}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    {day.tasks.map((task, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            <span>{task.time}</span>
                          </div>
                          <div>
                            <div className="font-medium">{task.company}</div>
                            <div className="text-sm text-muted-foreground">{task.type}</div>
                          </div>
                        </div>
                        <Badge variant={getPriorityColor(task.priority)}>
                          {task.priority}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Week</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">15</div>
              <p className="text-xs text-muted-foreground">Scheduled tasks</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">On-site Visits</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4</div>
              <p className="text-xs text-muted-foreground">This week</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Availability</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12h</div>
              <p className="text-xs text-muted-foreground">Free time remaining</p>
            </CardContent>
          </Card>
        </div>
        </>
        )}
      </div>
    </div>
  );
};

export default Schedule;
