import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { api } from '@/lib/api';
import AdminLayout from '@/components/layout/AdminLayout';
import { useToast } from '@/hooks/use-toast';
import { X } from 'lucide-react';

interface ProjectFormData {
  title: string;
  slug?: string;
  short_description: string;
  detailed_description: string;
  tech_stack: string[];
  category: string;
  cover_image_url: string;
  github_url: string;
  live_url: string;
  is_featured: boolean;
  display_order: number;
  readme_content: string;
}

const AdminProjectForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
 const [loading, setLoading] = useState<boolean>(!!id && id !== 'new');
  const [submitting, setSubmitting] = useState(false);
  const [techInput, setTechInput] = useState('');
  const [formData, setFormData] = useState<ProjectFormData>({
    title: '',
    slug: '',
    short_description: '',
    detailed_description: '',
    tech_stack: [],
    category: '',
    cover_image_url: '',
    github_url: '',
    live_url: '',
    is_featured: false,
    display_order: 0,
    readme_content: '',
  });

  useEffect(() => {
    if (id && id !== 'new') {
      loadProject();
    }
  }, [id]);

  const loadProject = async () => {
    try {
      const data = await api.get<ProjectFormData>(`/api/projects/${id}`);
      setFormData(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load project',
        variant: 'destructive',
      });
      navigate('/admin/projects');
    } finally {
      setLoading(false);
    }
  };

const handleChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
) => {
  const { name, value } = e.target;

  setFormData((prev) => ({
    ...prev,
    [name]:
      name === 'display_order'
        ? Number(value) || 0            // 👈 yahan number bana diya
        : value,
  }));
};


  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, is_featured: checked }));
  };

  const addTech = () => {
    if (techInput.trim() && !formData.tech_stack.includes(techInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        tech_stack: [...prev.tech_stack, techInput.trim()],
      }));
      setTechInput('');
    }
  };

  const removeTech = (tech: string) => {
    setFormData((prev) => ({
      ...prev,
      tech_stack: prev.tech_stack.filter((t) => t !== tech),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (id && id !== 'new') {
        await api.put(`/api/admin/projects/${id}`, formData);
        toast({
          title: 'Success',
          description: 'Project updated successfully',
        });
      } else {
        await api.post('/api/admin/projects', formData);
        toast({
          title: 'Success',
          description: 'Project created successfully',
        });
      }
      navigate('/admin/projects');
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to save project',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-12">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-4xl">
        <div>
          <h1 className="text-3xl font-bold">{id && id !== 'new' ? 'Edit Project' : 'Create Project'}</h1>
          <p className="text-muted-foreground mt-2">Fill in the project details</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Title *</label>
                <Input
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  placeholder="Project title"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Short Description *</label>
                <Textarea
                  name="short_description"
                  value={formData.short_description}
                  onChange={handleChange}
                  required
                  placeholder="Brief description of your project"
                  rows={3}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Detailed Description</label>
                <Textarea
                  name="detailed_description"
                  value={formData.detailed_description}
                  onChange={handleChange}
                  placeholder="More detailed project description"
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Project Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Category</label>
                  <Input
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    placeholder="e.g., Web Apps, E-Commerce"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Display Order</label>
                  <Input
                    name="display_order"
                    type="number"
                    value={formData.display_order}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Tech Stack</label>
                <div className="flex gap-2">
                  <Input
                    value={techInput}
                    onChange={(e) => setTechInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTech())}
                    placeholder="e.g., React"
                  />
                  <Button type="button" onClick={addTech} variant="outline">
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  {formData.tech_stack.map((tech) => (
                    <div
                      key={tech}
                      className="bg-primary text-primary-foreground rounded-full px-3 py-1 text-sm flex items-center gap-2"
                    >
                      {tech}
                      <button
                        type="button"
                        onClick={() => removeTech(tech)}
                        className="hover:opacity-70"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Images & Links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Cover Image URL</label>
                <Input
                  name="cover_image_url"
                  type="url"
                  value={formData.cover_image_url}
                  onChange={handleChange}
                  placeholder="https://..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">GitHub URL</label>
                  <Input
                    name="github_url"
                    type="url"
                    value={formData.github_url}
                    onChange={handleChange}
                    placeholder="https://github.com/..."
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Live URL</label>
                  <Input
                    name="live_url"
                    type="url"
                    value={formData.live_url}
                    onChange={handleChange}
                    placeholder="https://..."
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>README</CardTitle>
              <CardDescription>Markdown format supported (images, GIFs, YouTube links)</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                name="readme_content"
                value={formData.readme_content}
                onChange={handleChange}
                placeholder="# Project Name&#10;&#10;Project description..."
                rows={10}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Visibility</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Featured Project</label>
                <Switch checked={formData.is_featured} onCheckedChange={handleSwitchChange} />
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-4 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/admin/projects')}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Saving...' : 'Save Project'}
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default AdminProjectForm;
