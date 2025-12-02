import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import WhatsAppWidget from "@/components/WhatsAppWidget";
import PWAInstallButton from "@/components/PWAInstallButton";
import Home from "./pages/Home";
import About from "./pages/About";
import Skills from "./pages/Skills";
import Projects from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";
import Resume from "./pages/Resume";
import Contact from "./pages/Contact";
import Experience from "./pages/Experience";
import Certifications from "./pages/Certifications";
import Blogs from "./pages/Blogs";
import BlogDetail from "./pages/BlogDetail";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminProjects from "./pages/AdminProjects";
import AdminProjectForm from "./pages/AdminProjectForm";
import AdminContent from "./pages/AdminContent";
import AdminMessages from "./pages/AdminMessages";
import AdminTheme from "./pages/AdminTheme";
import AdminResume from "./pages/AdminResume";
import AdminExperience from "./pages/AdminExperience";
import AdminCertifications from "./pages/AdminCertifications";
import AdminBlogs from "./pages/AdminBlogs";

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <PWAInstallButton />
          <WhatsAppWidget />
          <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/skills" element={<Skills />} />
          <Route path="/experience" element={<Experience />} />
          <Route path="/certifications" element={<Certifications />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/blog/:slug" element={<BlogDetail />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:slug" element={<ProjectDetail />} />
          <Route path="/resume" element={<Resume />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/projects"
            element={
              <ProtectedRoute>
                <AdminProjects />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/projects/:id"
            element={
              <ProtectedRoute>
                <AdminProjectForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/content"
            element={
              <ProtectedRoute>
                <AdminContent />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/messages"
            element={
              <ProtectedRoute>
                <AdminMessages />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/theme"
            element={
              <ProtectedRoute>
                <AdminTheme />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/resume"
            element={
              <ProtectedRoute>
                <AdminResume />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/experience"
            element={
              <ProtectedRoute>
                <AdminExperience />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/certifications"
            element={
              <ProtectedRoute>
                <AdminCertifications />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/blogs"
            element={
              <ProtectedRoute>
                <AdminBlogs />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
