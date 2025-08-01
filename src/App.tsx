
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Tickets from "./pages/Tickets";
import NewTicket from "./pages/NewTicket";
import Schedule from "./pages/Schedule";
import Companies from "./pages/Companies";
import CompanyForm from "./pages/CompanyForm";
import CompanyDetails from "./pages/CompanyDetails";
import Reports from "./pages/Reports";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/tickets" element={<Tickets />} />
          <Route path="/tickets/new" element={<NewTicket />} />
          <Route path="/new-ticket" element={<NewTicket />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/companies" element={<Companies />} />
          <Route path="/companies/new" element={<CompanyForm />} />
          <Route path="/companies/:id" element={<CompanyDetails />} />
          <Route path="/companies/:id/edit" element={<CompanyForm />} />
          <Route path="/reports" element={<Reports />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
