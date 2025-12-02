import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
import AdminLayout from '@/components/layout/AdminLayout';
import { motion } from 'framer-motion';
import { FileText, Package, Mail, Briefcase, Award, BookOpen } from 'lucide-react';

interface DashboardStats {
  totalProjects: number;
  featuredProjects: number;
  totalMessages: number;
  totalExperience: number;
  totalCertifications: number;
  totalBlogs: number;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalProjects: 0,
    featuredProjects: 0,
    totalMessages: 0,
    totalExperience: 0,
    totalCertifications: 0,
    totalBlogs: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [projects, messages, experience, certifications, blogs] = await Promise.all([
          api.get<any[]>('/api/projects'),
          api.get<any[]>('/api/admin/messages'),
          api.get<any[]>('/api/experience'),
          api.get<any[]>('/api/certifications'),
          api.get<any[]>('/api/blogs'),
        ]);

        setStats({
          totalProjects: projects.length,
          featuredProjects: projects.filter((p) => p.is_featured).length,
          totalMessages: messages.length,
          totalExperience: experience.length,
          totalCertifications: certifications.length,
          totalBlogs: blogs.length,
        });
      } catch (error) {
        console.error('Failed to load stats:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  const statCards = [
    {
      title: 'Total Projects',
      value: stats.totalProjects,
      icon: Package,
      href: '/admin/projects',
    },
    {
      title: 'Featured Projects',
      value: stats.featuredProjects,
      icon: FileText,
      href: '/admin/projects',
    },
    {
      title: 'Experiences',
      value: stats.totalExperience,
      icon: Briefcase,
      href: '/admin/experience',
    },
    {
      title: 'Certifications',
      value: stats.totalCertifications,
      icon: Award,
      href: '/admin/certifications',
    },
    {
      title: 'Blog Posts',
      value: stats.totalBlogs,
      icon: BookOpen,
      href: '/admin/blogs',
    },
    {
      title: 'Messages Received',
      value: stats.totalMessages,
      icon: Mail,
      href: '/admin/messages',
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-2">Welcome to your portfolio admin panel</p>
        </div>

        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
          {statCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link to={card.href}>
                  <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0">
                      <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                      <Icon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{loading ? '...' : card.value}</div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            );
          })}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Manage your portfolio content</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link to="/admin/projects/new">
                <Button variant="outline" className="w-full justify-start">
                  + Create New Project
                </Button>
              </Link>
              <Link to="/admin/experience">
                <Button variant="outline" className="w-full justify-start">
                  Manage Experience
                </Button>
              </Link>
              <Link to="/admin/certifications">
                <Button variant="outline" className="w-full justify-start">
                  Manage Certifications
                </Button>
              </Link>
              <Link to="/admin/blogs">
                <Button variant="outline" className="w-full justify-start">
                  Create Blog Post
                </Button>
              </Link>
              <Link to="/admin/content">
                <Button variant="outline" className="w-full justify-start">
                  Edit Content Sections
                </Button>
              </Link>
              <Link to="/admin/resume">
                <Button variant="outline" className="w-full justify-start">
                  Manage Resumes
                </Button>
              </Link>
              <Link to="/admin/theme">
                <Button variant="outline" className="w-full justify-start">
                  Customize Theme
                </Button>
              </Link>
              <Link to="/admin/messages">
                <Button variant="outline" className="w-full justify-start">
                  View Messages
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Helpful Resources</CardTitle>
              <CardDescription>Learn more about features</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Use the sidebar to navigate between different management sections of your portfolio.
              </p>
              <p className="text-sm text-muted-foreground">
                All changes are saved to MongoDB and immediately reflected on your public portfolio.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
