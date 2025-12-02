import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import AdminLayout from '@/components/layout/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { api } from '@/lib/api';
import { motion } from 'framer-motion';
import { FileText, Plus, Edit2, Trash2, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

interface Resume {
  _id: string;
  fullName: string;
  title: string;
  email: string;
  location: string;
  isActive: boolean;
  createdAt: string;
}

interface ResumeFormData {
  fullName: string;
  title: string;
  email: string;
  phone?: string;
  location: string;
  profileImage?: string;
  summary: string;
  experience: any[];
  education: any[];
  skills: any[];
  isActive: boolean;
}

const AdminResume = () => {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<ResumeFormData>({
    fullName: '',
    title: '',
    email: '',
    phone: '',
    location: '',
    profileImage: '',
    summary: '',
    experience: [],
    education: [],
    skills: [],
    isActive: false,
  });

  const {
    data: resumes = [],
    isLoading,
  } = useQuery({
    queryKey: ['resumes'],
    queryFn: () => api.get('/api/admin/resumes'),
  });

  const createMutation = useMutation({
    mutationFn: (data: ResumeFormData) => api.post('/api/admin/resumes', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resumes'] });
      toast.success('Resume created successfully');
      setShowForm(false);
      resetForm();
    },
    onError: () => {
      toast.error('Failed to create resume');
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: ResumeFormData) =>
      api.patch(`/api/admin/resumes/${editingId}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resumes'] });
      toast.success('Resume updated successfully');
      setShowForm(false);
      setEditingId(null);
      resetForm();
    },
    onError: () => {
      toast.error('Failed to update resume');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/api/admin/resumes/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resumes'] });
      toast.success('Resume deleted successfully');
    },
    onError: () => {
      toast.error('Failed to delete resume');
    },
  });

  const activateMutation = useMutation({
    mutationFn: (id: string) => api.patch(`/api/admin/resumes/${id}/activate`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resumes'] });
      toast.success('Resume activated');
    },
    onError: () => {
      toast.error('Failed to activate resume');
    },
  });

  const resetForm = () => {
    setFormData({
      fullName: '',
      title: '',
      email: '',
      phone: '',
      location: '',
      profileImage: '',
      summary: '',
      experience: [],
      education: [],
      skills: [],
      isActive: false,
    });
  };

  const handleEdit = (resume: Resume) => {
    setEditingId(resume._id);
    setFormData({
      fullName: resume.fullName,
      title: resume.title,
      email: resume.email,
      phone: '',
      location: resume.location,
      profileImage: '',
      summary: '',
      experience: [],
      education: [],
      skills: [],
      isActive: resume.isActive,
    });
    setShowForm(true);
  };

  const handleSubmit = () => {
    if (!formData.fullName || !formData.title || !formData.email || !formData.location || !formData.summary) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (editingId) {
      updateMutation.mutate(formData);
    } else {
      createMutation.mutate(formData);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Resume Management</h1>
            <p className="text-muted-foreground mt-2">Create and manage your professional resumes</p>
          </div>
          {!showForm && (
            <Button onClick={() => {
              setEditingId(null);
              resetForm();
              setShowForm(true);
            }} className="gap-2">
              <Plus className="h-4 w-4" />
              Create Resume
            </Button>
          )}
        </div>

        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>{editingId ? 'Edit Resume' : 'Create New Resume'}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Full Name *</label>
                    <Input
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Professional Title *</label>
                    <Input
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="e.g., MERN Stack Developer"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Email *</label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="your@email.com"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Phone</label>
                    <Input
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="Your phone number"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Location *</label>
                    <Input
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="City, Country"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Profile Image URL</label>
                    <Input
                      value={formData.profileImage}
                      onChange={(e) => setFormData({ ...formData, profileImage: e.target.value })}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Professional Summary *</label>
                  <textarea
                    value={formData.summary}
                    onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                    placeholder="Brief overview of your professional background"
                    className="w-full px-3 py-2 border rounded-md border-input bg-background min-h-24"
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={handleSubmit}
                    disabled={createMutation.isPending || updateMutation.isPending}
                  >
                    {editingId ? 'Update Resume' : 'Create Resume'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowForm(false);
                      setEditingId(null);
                      resetForm();
                    }}
                  >
                    Cancel
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Note: Full resume details with experience, education, and skills can be edited after creation.
                  For now, create the base resume and then configure details in the full editor.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {isLoading ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Loading resumes...</p>
          </div>
        ) : resumes.length === 0 ? (
          <Card>
            <CardContent className="py-12">
              <div className="text-center">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold mb-2">No Resumes Yet</h3>
                <p className="text-muted-foreground mb-4">Create your first resume to get started</p>
                <Button onClick={() => {
                  setEditingId(null);
                  resetForm();
                  setShowForm(true);
                }}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Resume
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {resumes.map((resume: Resume, index: number) => (
              <motion.div
                key={resume._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="py-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <FileText className="h-5 w-5 text-primary" />
                          <h3 className="font-bold text-lg">{resume.fullName}</h3>
                          {resume.isActive && (
                            <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-green-500/10 text-green-600 text-xs font-medium">
                              <CheckCircle className="h-3 w-3" />
                              Active
                            </span>
                          )}
                        </div>
                        <p className="text-primary font-medium">{resume.title}</p>
                        <div className="flex gap-4 text-sm text-muted-foreground mt-2">
                          <span>{resume.email}</span>
                          <span>{resume.location}</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                          Created: {new Date(resume.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        {!resume.isActive && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => activateMutation.mutate(resume._id)}
                            disabled={activateMutation.isPending}
                          >
                            Activate
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(resume)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => deleteMutation.mutate(resume._id)}
                          disabled={deleteMutation.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminResume;
