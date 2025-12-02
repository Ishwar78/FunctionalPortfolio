import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { api } from '@/lib/api';
import AdminLayout from '@/components/layout/AdminLayout';
import { useToast } from '@/hooks/use-toast';
import { Edit2, Trash2, Plus, X } from 'lucide-react';
import { ImageInput } from '@/components/AdminImageUpload';

interface Experience {
  _id: string;
  position: string;
  company: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  location: string;
  description: string[];
  technologies: string[];
  companyLogo?: string;
}

interface FormData {
  position: string;
  company: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  location: string;
  description: string[];
  technologies: string[];
  companyLogo: string;
}

const AdminExperience = () => {
  const { toast } = useToast();
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    position: '',
    company: '',
    startDate: '',
    endDate: '',
    isCurrent: false,
    location: '',
    description: [],
    technologies: [],
    companyLogo: '',
  });

  useEffect(() => {
    loadExperiences();
  }, []);

  const loadExperiences = async () => {
    try {
      const data = await api.get<Experience[]>('/api/experience');
      setExperiences(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load experiences',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      position: '',
      company: '',
      startDate: '',
      endDate: '',
      isCurrent: false,
      location: '',
      description: [],
      technologies: [],
      companyLogo: '',
    });
    setEditingId(null);
  };

  const handleEdit = (exp: Experience) => {
    setFormData({
      position: exp.position,
      company: exp.company,
      startDate: exp.startDate,
      endDate: exp.endDate,
      isCurrent: exp.isCurrent,
      location: exp.location,
      description: exp.description,
      technologies: exp.technologies,
      companyLogo: exp.companyLogo || '',
    });
    setEditingId(exp._id);
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formData.position || !formData.company || !formData.startDate || !formData.location) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    if (!formData.isCurrent && !formData.endDate) {
      toast({
        title: 'Error',
        description: 'End date is required if this is not a current position',
        variant: 'destructive',
      });
      return;
    }

    setSaving(true);
    try {
      if (editingId) {
        await api.patch(`/api/admin/experience/${editingId}`, formData);
        toast({
          title: 'Success',
          description: 'Experience updated successfully',
        });
      } else {
        await api.post('/api/admin/experience', formData);
        toast({
          title: 'Success',
          description: 'Experience created successfully',
        });
      }
      resetForm();
      setDialogOpen(false);
      loadExperiences();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save experience',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/api/admin/experience/${id}`);
      setExperiences(experiences.filter((e) => e._id !== id));
      toast({
        title: 'Success',
        description: 'Experience deleted successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete experience',
        variant: 'destructive',
      });
    }
  };

  const filteredExperiences = experiences.filter((e) =>
    e.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Experience</h1>
            <p className="text-muted-foreground mt-2">Manage your work experience and positions</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => resetForm()}>
                <Plus className="mr-2 h-4 w-4" />
                Add Experience
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingId ? 'Edit Experience' : 'Add New Experience'}
                </DialogTitle>
                <DialogDescription>
                  {editingId
                    ? 'Update your work experience details'
                    : 'Add a new work experience entry'}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Position *</label>
                    <Input
                      value={formData.position}
                      onChange={(e) =>
                        setFormData({ ...formData, position: e.target.value })
                      }
                      placeholder="e.g., Senior Developer"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Company *</label>
                    <Input
                      value={formData.company}
                      onChange={(e) =>
                        setFormData({ ...formData, company: e.target.value })
                      }
                      placeholder="e.g., Tech Company Inc"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Location *</label>
                  <Input
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    placeholder="e.g., San Francisco, CA"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Start Date *</label>
                    <Input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) =>
                        setFormData({ ...formData, startDate: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">End Date</label>
                    <Input
                      type="date"
                      value={formData.endDate}
                      onChange={(e) =>
                        setFormData({ ...formData, endDate: e.target.value })
                      }
                      disabled={formData.isCurrent}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="isCurrent"
                    checked={formData.isCurrent}
                    onCheckedChange={(checked) => {
                      setFormData({
                        ...formData,
                        isCurrent: checked as boolean,
                        endDate: checked ? '' : formData.endDate,
                      });
                    }}
                  />
                  <label htmlFor="isCurrent" className="text-sm font-medium cursor-pointer">
                    Currently working here
                  </label>
                </div>
                <ImageInput
                  label="Company Logo"
                  value={formData.companyLogo}
                  onChange={(value) =>
                    setFormData({ ...formData, companyLogo: value })
                  }
                  placeholder="Company logo URL..."
                  preview
                />
                <div>
                  <label className="text-sm font-medium mb-2 block">Description Points</label>
                  {formData.description.map((desc, idx) => (
                    <div key={idx} className="flex gap-2 mb-2">
                      <Textarea
                        value={desc}
                        onChange={(e) => {
                          const newDesc = [...formData.description];
                          newDesc[idx] = e.target.value;
                          setFormData({ ...formData, description: newDesc });
                        }}
                        placeholder="e.g., Led a team of 5 developers..."
                        rows={2}
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          const newDesc = formData.description.filter((_, i) => i !== idx);
                          setFormData({ ...formData, description: newDesc });
                        }}
                      >
                        <X size={16} />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setFormData({
                        ...formData,
                        description: [...formData.description, ''],
                      });
                    }}
                  >
                    <Plus size={16} className="mr-1" /> Add Description
                  </Button>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Technologies (comma separated)</label>
                  <Input
                    value={formData.technologies.join(', ')}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        technologies: e.target.value
                          .split(',')
                          .map((s) => s.trim())
                          .filter((s) => s),
                      })
                    }
                    placeholder="e.g., React, Node.js, MongoDB"
                  />
                </div>
                <div className="flex gap-2 justify-end pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleSave} disabled={saving}>
                    {saving ? 'Saving...' : 'Save'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex gap-4">
          <Input
            placeholder="Search by position or company..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>

        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Position</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Technologies</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-4">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : filteredExperiences.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-4">
                    No experiences found
                  </TableCell>
                </TableRow>
              ) : (
                filteredExperiences.map((exp) => (
                  <TableRow key={exp._id}>
                    <TableCell className="font-medium">{exp.position}</TableCell>
                    <TableCell>{exp.company}</TableCell>
                    <TableCell>{exp.location}</TableCell>
                    <TableCell>{exp.startDate}</TableCell>
                    <TableCell>{exp.isCurrent ? 'Present' : exp.endDate}</TableCell>
                    <TableCell>{exp.technologies.join(', ') || '-'}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(exp)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm" variant="destructive">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogTitle>Delete Experience</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this experience? This action cannot be
                              undone.
                            </AlertDialogDescription>
                            <div className="flex justify-end gap-2">
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(exp._id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Delete
                              </AlertDialogAction>
                            </div>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminExperience;
