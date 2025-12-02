import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
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
import { api } from '@/lib/api';
import AdminLayout from '@/components/layout/AdminLayout';
import { useToast } from '@/hooks/use-toast';
import { Edit2, Trash2, Plus } from 'lucide-react';
import { ImageInput } from '@/components/AdminImageUpload';

interface Certification {
  _id: string;
  title: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  credentialId?: string;
  credentialUrl?: string;
  certificateImage?: string;
  description?: string;
  skills?: string[];
}

interface FormData {
  title: string;
  issuer: string;
  issueDate: string;
  expiryDate: string;
  credentialId: string;
  credentialUrl: string;
  certificateImage: string;
  description: string;
  skills: string[];
}

const AdminCertifications = () => {
  const { toast } = useToast();
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    title: '',
    issuer: '',
    issueDate: '',
    expiryDate: '',
    credentialId: '',
    credentialUrl: '',
    certificateImage: '',
    description: '',
    skills: [],
  });

  useEffect(() => {
    loadCertifications();
  }, []);

  const loadCertifications = async () => {
    try {
      const data = await api.get<Certification[]>('/api/certifications');
      setCertifications(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load certifications',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      issuer: '',
      issueDate: '',
      expiryDate: '',
      credentialId: '',
      credentialUrl: '',
      certificateImage: '',
      description: '',
      skills: [],
    });
    setEditingId(null);
  };

  const handleEdit = (cert: Certification) => {
    setFormData({
      title: cert.title,
      issuer: cert.issuer,
      issueDate: cert.issueDate,
      expiryDate: cert.expiryDate || '',
      credentialId: cert.credentialId || '',
      credentialUrl: cert.credentialUrl || '',
      certificateImage: cert.certificateImage || '',
      description: cert.description || '',
      skills: cert.skills || [],
    });
    setEditingId(cert._id);
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formData.title || !formData.issuer || !formData.issueDate) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    setSaving(true);
    try {
      if (editingId) {
        await api.patch(`/api/admin/certifications/${editingId}`, formData);
        toast({
          title: 'Success',
          description: 'Certification updated successfully',
        });
      } else {
        await api.post('/api/admin/certifications', formData);
        toast({
          title: 'Success',
          description: 'Certification created successfully',
        });
      }
      resetForm();
      setDialogOpen(false);
      loadCertifications();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save certification',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/api/admin/certifications/${id}`);
      setCertifications(certifications.filter((c) => c._id !== id));
      toast({
        title: 'Success',
        description: 'Certification deleted successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete certification',
        variant: 'destructive',
      });
    }
  };

  const filteredCertifications = certifications.filter((c) =>
    c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.issuer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Certifications</h1>
            <p className="text-muted-foreground mt-2">Manage your certifications and training courses</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => resetForm()}>
                <Plus className="mr-2 h-4 w-4" />
                Add Certification
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingId ? 'Edit Certification' : 'Add New Certification'}
                </DialogTitle>
                <DialogDescription>
                  {editingId
                    ? 'Update the certification details'
                    : 'Add a new certification or training course'}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Title *</label>
                  <Input
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    placeholder="e.g., AWS Solutions Architect"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Issuer *</label>
                  <Input
                    value={formData.issuer}
                    onChange={(e) =>
                      setFormData({ ...formData, issuer: e.target.value })
                    }
                    placeholder="e.g., Amazon Web Services"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Issue Date *</label>
                    <Input
                      type="date"
                      value={formData.issueDate}
                      onChange={(e) =>
                        setFormData({ ...formData, issueDate: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Expiry Date</label>
                    <Input
                      type="date"
                      value={formData.expiryDate}
                      onChange={(e) =>
                        setFormData({ ...formData, expiryDate: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Credential ID</label>
                  <Input
                    value={formData.credentialId}
                    onChange={(e) =>
                      setFormData({ ...formData, credentialId: e.target.value })
                    }
                    placeholder="e.g., AWS-123456"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Credential URL</label>
                  <Input
                    type="url"
                    value={formData.credentialUrl}
                    onChange={(e) =>
                      setFormData({ ...formData, credentialUrl: e.target.value })
                    }
                    placeholder="https://..."
                  />
                </div>
                <ImageInput
                  label="Certificate Image"
                  value={formData.certificateImage}
                  onChange={(value) =>
                    setFormData({ ...formData, certificateImage: value })
                  }
                  placeholder="Certificate image URL..."
                  preview
                />
                <div>
                  <label className="text-sm font-medium">Description</label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Details about the certification..."
                    rows={3}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Skills (comma separated)</label>
                  <Input
                    value={formData.skills.join(', ')}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        skills: e.target.value
                          .split(',')
                          .map((s) => s.trim())
                          .filter((s) => s),
                      })
                    }
                    placeholder="e.g., AWS, Cloud Architecture, DevOps"
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
            placeholder="Search by title or issuer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>

        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Issuer</TableHead>
                <TableHead>Issue Date</TableHead>
                <TableHead>Expiry Date</TableHead>
                <TableHead>Skills</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : filteredCertifications.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4">
                    No certifications found
                  </TableCell>
                </TableRow>
              ) : (
                filteredCertifications.map((cert) => (
                  <TableRow key={cert._id}>
                    <TableCell className="font-medium">{cert.title}</TableCell>
                    <TableCell>{cert.issuer}</TableCell>
                    <TableCell>{cert.issueDate}</TableCell>
                    <TableCell>{cert.expiryDate || '-'}</TableCell>
                    <TableCell>{(cert.skills || []).join(', ') || '-'}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(cert)}
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
                            <AlertDialogTitle>Delete Certification</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this certification? This action cannot
                              be undone.
                            </AlertDialogDescription>
                            <div className="flex justify-end gap-2">
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(cert._id)}
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

export default AdminCertifications;
