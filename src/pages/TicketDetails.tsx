import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Calendar, Clock, Users, FileText, MessageSquare, Save, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Ticket {
  id: string;
  title: string;
  description?: string;
  status: string;
  priority: string;
  company_id?: string;
  category_id?: string;
  assigned_to?: string;
  reporter_name?: string;
  reporter_email?: string;
  due_date?: string;
  resolved_at?: string;
  time_spent?: number;
  created_at: string;
  updated_at: string;
  companies?: {
    name: string;
  };
  ticket_categories?: {
    name: string;
  };
}

interface Comment {
  id: string;
  comment: string;
  author_name?: string;
  author_email?: string;
  is_internal: boolean;
  created_at: string;
}

const TicketDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [commentAuthorName, setCommentAuthorName] = useState("");
  const [commentAuthorEmail, setCommentAuthorEmail] = useState("");
  const [isInternalComment, setIsInternalComment] = useState(false);

  // Form states for editing
  const [editMode, setEditMode] = useState(false);
  const [editedStatus, setEditedStatus] = useState("");
  const [editedPriority, setEditedPriority] = useState("");
  const [editedTimeSpent, setEditedTimeSpent] = useState("");
  const [editedAssignedTo, setEditedAssignedTo] = useState("");

  useEffect(() => {
    if (id) {
      fetchTicketDetails();
      fetchComments();
    }
  }, [id]);

  const fetchTicketDetails = async () => {
    try {
      const { data, error } = await supabase
        .from('tickets')
        .select(`
          *,
          companies (name),
          ticket_categories (name)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      setTicket(data);
      setEditedStatus(data.status);
      setEditedPriority(data.priority);
      setEditedTimeSpent(data.time_spent?.toString() || "0");
      setEditedAssignedTo(data.assigned_to || "");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load ticket details",
        variant: "destructive",
      });
      navigate('/tickets');
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const { data, error } = await supabase
        .from('ticket_comments')
        .select('*')
        .eq('ticket_id', id)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setComments(data || []);
    } catch (error) {
      console.error('Failed to fetch comments:', error);
    }
  };

  const updateTicket = async () => {
    if (!ticket) return;
    
    setUpdating(true);
    try {
      const { error } = await supabase
        .from('tickets')
        .update({
          status: editedStatus,
          priority: editedPriority,
          time_spent: parseFloat(editedTimeSpent) || 0,
          assigned_to: editedAssignedTo || null,
          resolved_at: editedStatus === 'resolved' ? new Date().toISOString() : null,
        })
        .eq('id', ticket.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Ticket updated successfully",
      });
      
      await fetchTicketDetails();
      setEditMode(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update ticket",
        variant: "destructive",
      });
    } finally {
      setUpdating(false);
    }
  };

  const addComment = async () => {
    if (!newComment.trim() || !ticket) return;

    try {
      const { error } = await supabase
        .from('ticket_comments')
        .insert([{
          ticket_id: ticket.id,
          comment: newComment,
          author_name: commentAuthorName || 'Anonymous',
          author_email: commentAuthorEmail || null,
          is_internal: isInternalComment,
        }]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Comment added successfully",
      });

      setNewComment("");
      setCommentAuthorName("");
      setCommentAuthorEmail("");
      await fetchComments();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add comment",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open": return "destructive";
      case "in_progress": return "default";
      case "resolved": return "secondary";
      case "closed": return "outline";
      default: return "secondary";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "text-red-600";
      case "medium": return "text-yellow-600";
      case "low": return "text-green-600";
      default: return "text-muted-foreground";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center">
          <Loader2 className="h-8 w-8 animate-spin mr-2" />
          <span>Loading ticket details...</span>
        </div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Ticket not found</h2>
          <p className="text-muted-foreground mb-4">The ticket you're looking for doesn't exist.</p>
          <Link to="/tickets">
            <Button>Back to Tickets</Button>
          </Link>
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
            <div className="flex items-center gap-4">
              <Link to="/tickets">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Tickets
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-foreground">{ticket.title}</h1>
                <p className="text-muted-foreground">Ticket Details</p>
              </div>
            </div>
            <div className="flex gap-2">
              {editMode ? (
                <>
                  <Button variant="outline" onClick={() => setEditMode(false)}>
                    Cancel
                  </Button>
                  <Button onClick={updateTicket} disabled={updating}>
                    {updating ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                    Save Changes
                  </Button>
                </>
              ) : (
                <Button onClick={() => setEditMode(true)}>
                  Edit Ticket
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Ticket Info */}
            <Card>
              <CardHeader>
                <CardTitle>Ticket Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <Badge variant={getStatusColor(ticket.status)}>
                    {editMode ? (
                      <Select value={editedStatus} onValueChange={setEditedStatus}>
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="open">Open</SelectItem>
                          <SelectItem value="in_progress">In Progress</SelectItem>
                          <SelectItem value="resolved">Resolved</SelectItem>
                          <SelectItem value="closed">Closed</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      ticket.status.replace('_', ' ')
                    )}
                  </Badge>
                  <span className={`text-sm font-medium ${getPriorityColor(ticket.priority)}`}>
                    {editMode ? (
                      <Select value={editedPriority} onValueChange={setEditedPriority}>
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      `${ticket.priority} priority`
                    )}
                  </span>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-muted-foreground">{ticket.description || 'No description provided'}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Time Spent (hours)</label>
                    {editMode ? (
                      <Input
                        type="number"
                        step="0.5"
                        min="0"
                        value={editedTimeSpent}
                        onChange={(e) => setEditedTimeSpent(e.target.value)}
                      />
                    ) : (
                      <p className="text-sm text-muted-foreground">{ticket.time_spent || 0} hours</p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium">Assigned To</label>
                    {editMode ? (
                      <Input
                        value={editedAssignedTo}
                        onChange={(e) => setEditedAssignedTo(e.target.value)}
                        placeholder="Enter assignee name"
                      />
                    ) : (
                      <p className="text-sm text-muted-foreground">{ticket.assigned_to || 'Unassigned'}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Comments */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Comments ({comments.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {comments.map((comment) => (
                  <div key={comment.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{comment.author_name || 'Anonymous'}</span>
                        {comment.is_internal && (
                          <Badge variant="outline" className="text-xs">Internal</Badge>
                        )}
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {format(new Date(comment.created_at), 'MMM dd, yyyy HH:mm')}
                      </span>
                    </div>
                    <p className="text-sm">{comment.comment}</p>
                  </div>
                ))}

                <Separator />

                {/* Add Comment */}
                <div className="space-y-3">
                  <h4 className="font-medium">Add Comment</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      placeholder="Your name"
                      value={commentAuthorName}
                      onChange={(e) => setCommentAuthorName(e.target.value)}
                    />
                    <Input
                      placeholder="Your email (optional)"
                      value={commentAuthorEmail}
                      onChange={(e) => setCommentAuthorEmail(e.target.value)}
                    />
                  </div>
                  <Textarea
                    placeholder="Write your comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    rows={3}
                  />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="internal"
                        checked={isInternalComment}
                        onChange={(e) => setIsInternalComment(e.target.checked)}
                      />
                      <label htmlFor="internal" className="text-sm">Internal comment</label>
                    </div>
                    <Button onClick={addComment} disabled={!newComment.trim()}>
                      Add Comment
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Details */}
            <Card>
              <CardHeader>
                <CardTitle>Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Users className="h-4 w-4" />
                  <span className="font-medium">Company:</span>
                  <span>{ticket.companies?.name || 'No company'}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <FileText className="h-4 w-4" />
                  <span className="font-medium">Category:</span>
                  <span>{ticket.ticket_categories?.name || 'No category'}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-medium">Reporter:</span>
                  <span>{ticket.reporter_name || 'Anonymous'}</span>
                </div>
                {ticket.reporter_email && (
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-medium">Email:</span>
                    <span>{ticket.reporter_email}</span>
                  </div>
                )}
                {ticket.due_date && (
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4" />
                    <span className="font-medium">Due:</span>
                    <span>{format(new Date(ticket.due_date), 'MMM dd, yyyy')}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>Timeline</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4" />
                  <span className="font-medium">Created:</span>
                  <span>{format(new Date(ticket.created_at), 'MMM dd, yyyy HH:mm')}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4" />
                  <span className="font-medium">Updated:</span>
                  <span>{format(new Date(ticket.updated_at), 'MMM dd, yyyy HH:mm')}</span>
                </div>
                {ticket.resolved_at && (
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4" />
                    <span className="font-medium">Resolved:</span>
                    <span>{format(new Date(ticket.resolved_at), 'MMM dd, yyyy HH:mm')}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketDetails;