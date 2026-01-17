import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ScrollToTop } from "@/components/ScrollToTop";
import UnderConstruction from "./pages/UnderConstruction";
import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import Noticias from "./pages/Noticias";
import Pricing from "./pages/Pricing";
import Contact from "./pages/Contact";
import AulaExperimental from "./pages/AulaExperimental";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminAthletes from "./pages/admin/AdminAthletes";
import AdminClasses from "./pages/admin/AdminClasses";
import AdminRoles from "./pages/admin/AdminRoles";
import AdminEnrollments from "./pages/admin/AdminEnrollments";
import AdminEvents from "./pages/admin/AdminEvents";
import AdminPosts from "./pages/admin/AdminPosts";
import AdminTestimonials from "./pages/admin/AdminTestimonials";
import Agenda from "./pages/Agenda";
import ClassAttendance from "./pages/trainer/ClassAttendance";
import NotFound from "./pages/NotFound";
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/quem-somos" element={<About />} />
            <Route path="/modalidades" element={<Services />} />
            <Route path="/noticias" element={<Noticias />} />
            <Route path="/precos" element={<Pricing />} />
            <Route path="/contacto" element={<Contact />} />
            <Route path="/aula-experimental" element={<AulaExperimental />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/perfil" element={<Profile />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/atletas" element={<AdminAthletes />} />
            <Route path="/admin/turmas" element={<AdminClasses />} />
            <Route path="/admin/permissoes" element={<AdminRoles />} />
            <Route path="/admin/inscricoes" element={<AdminEnrollments />} />
            <Route path="/admin/eventos" element={<AdminEvents />} />
            <Route path="/admin/noticias" element={<AdminPosts />} />
            <Route path="/admin/testemunhos" element={<AdminTestimonials />} />
            <Route path="/agenda" element={<Agenda />} />
            <Route path="/treinador/presencas/:classId" element={<ClassAttendance />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
