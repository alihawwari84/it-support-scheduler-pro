
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Users } from "lucide-react";
import { Link } from "react-router-dom";

const Schedule = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const companies = [
    {
      name: "UCS",
      type: "Remote support",
      schedule: "As needed",
      color: "bg-blue-500"
    },
    {
      name: "EMCC",
      type: "Remote support",
      schedule: "As needed",
      color: "bg-green-500"
    },
    {
      name: "Praxis",
      type: "On-site visit",
      schedule: "Every Monday at 5:00 PM",
      color: "bg-purple-500"
    },
    {
      name: "Flucon",
      type: "Remote support",
      schedule: "As needed",
      color: "bg-orange-500"
    },
    {
      name: "Dudin",
      type: "Remote support",
      schedule: "As needed",
      color: "bg-pink-500"
    },
    {
      name: "FNCS",
      type: "Remote support",
      schedule: "As needed",
      color: "bg-cyan-500"
    },
    {
      name: "Exclusive",
      type: "On-site visits",
      schedule: "Sunday & Wednesday",
      color: "bg-red-500"
    },
    {
      name: "Injaz",
      type: "Full-time",
      schedule: "9:00 AM - 4:30 PM daily",
      color: "bg-indigo-500"
    }
  ];

  const weekSchedule = [
    {
      day: "Monday",
      date: "2024-06-10",
      tasks: [
        { time: "09:00 - 16:30", company: "Injaz", type: "Full-time shift", priority: "high" },
        { time: "17:00 - 18:00", company: "Praxis", type: "On-site visit", priority: "high" }
      ]
    },
    {
      day: "Tuesday",
      date: "2024-06-11",
      tasks: [
        { time: "09:00 - 16:30", company: "Injaz", type: "Full-time shift", priority: "high" },
        { time: "10:00 - 11:00", company: "UCS", type: "Network troubleshooting", priority: "medium" }
      ]
    },
    {
      day: "Wednesday",
      date: "2024-06-12",
      tasks: [
        { time: "09:00 - 16:30", company: "Injaz", type: "Full-time shift", priority: "high" },
        { time: "18:00 - 19:00", company: "Exclusive", type: "On-site visit", priority: "high" }
      ]
    },
    {
      day: "Thursday",
      date: "2024-06-13",
      tasks: [
        { time: "09:00 - 16:30", company: "Injaz", type: "Full-time shift", priority: "high" },
        { time: "14:00 - 14:30", company: "EMCC", type: "Email setup", priority: "low" }
      ]
    },
    {
      day: "Friday",
      date: "2024-06-14",
      tasks: [
        { time: "09:00 - 16:30", company: "Injaz", type: "Full-time shift", priority: "high" }
      ]
    },
    {
      day: "Saturday",
      date: "2024-06-15",
      tasks: [
        { time: "10:00 - 11:00", company: "Flucon", type: "Software installation", priority: "medium" }
      ]
    },
    {
      day: "Sunday",
      date: "2024-06-16",
      tasks: [
        { time: "14:00 - 15:00", company: "Exclusive", type: "On-site visit", priority: "high" }
      ]
    }
  ];

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
              <Button>Add Appointment</Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Company Overview */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Company Schedule Overview</CardTitle>
            <CardDescription>Fixed schedules and commitments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {companies.map((company) => (
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
      </div>
    </div>
  );
};

export default Schedule;
