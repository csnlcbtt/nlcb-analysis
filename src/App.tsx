
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import PlayWhe from "./pages/PlayWhe";
import Pick2 from "./pages/Pick2";
import Pick4 from "./pages/Pick4";
import Cashpot from "./pages/Cashpot";
import Lotto from "./pages/Lotto";
import WinForLife from "./pages/WinForLife";
import Contact from "./pages/Contact";
import About from "./pages/About";
import AdminDashboard from "./pages/AdminDashboard";
import Results from "./pages/Results";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/playwhe" element={<PlayWhe />} />
          <Route path="/pick2" element={<Pick2 />} />
          <Route path="/pick4" element={<Pick4 />} />
          <Route path="/cashpot" element={<Cashpot />} />
          <Route path="/lotto" element={<Lotto />} />
          <Route path="/winforlife" element={<WinForLife />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/results" element={<Results />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
