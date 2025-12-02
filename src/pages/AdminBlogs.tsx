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
import { Checkbox } from '@/components/ui/checkbox';
import { api } from '@/lib/api';
import AdminLayout from '@/components/layout/AdminLayout';
import { useToast } from '@/hooks/use-toast';
import { Edit2, Trash2, Plus, X } from 'lucide-react';
import { ImageInput } from '@/components/AdminImageUpload';
import { motion } from 'framer-motion';

interface Blog {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage?: string;
  author: string;
  category: string;
  tags: string[];
  isPublished: boolean;
  viewCount: number;
  publishedAt: string;
}

interface FormData {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  author: string;
  category: string;
  tags: string[];
  isPublished: boolean;
}

const AdminBlogs = () => {
  const { toast } = useToast();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    featuredImage: '',
    author: 'Admin',
    category: '',
    tags: [],
    isPublished: false,
  });

  useEffect(() => {
    loadBlogs();
  }, []);

  const loadBlogs = async () => {
    try {
      const data = await api.get<Blog[]>('/api/blogs');
      setBlogs(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load blogs',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  };

  const resetForm = () => {
    setFormData({
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      featuredImage: '',
      author: 'Admin',
      category: '',
      tags: [],
      isPublished: false,
    });
    setEditingId(null);
  };

  const handleEdit = (blog: Blog) => {
    setFormData({
      title: blog.title,
      slug: blog.slug,
      excerpt: blog.excerpt,
      content: blog.content,
      featuredImage: blog.featuredImage || '',
      author: blog.author,
      category: blog.category,
      tags: blog.tags,
      isPublished: blog.isPublished,
    });
    setEditingId(blog._id);
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formData.title || !formData.excerpt || !formData.content || !formData.category) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields (Title, Excerpt, Content, Category)',
        variant: 'destructive',
      });
      return;
    }

    setSaving(true);
    try {
      const slug = formData.slug || generateSlug(formData.title);
      
      if (editingId) {
        await api.patch(`/api/admin/blogs/${editingId}`, {
          ...formData,
          slug,
        });
        toast({
          title: 'Success',
          description: 'Blog updated successfully',
        });
      } else {
        await api.post('/api/admin/blogs', {
          ...formData,
          slug,
        });
        toast({
          title: 'Success',
          description: 'Blog created successfully',
        });
      }
      resetForm();
      setDialogOpen(false);
      loadBlogs();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save blog',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/api/admin/blogs/${id}`);
      setBlogs(blogs.filter((b) => b._id !== id));
      toast({
        title: 'Success',
        description: 'Blog deleted successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete blog',
        variant: 'destructive',
      });
    }
  };

  const filteredBlogs = blogs.filter((b) =>
    b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Blogs</h1>
            <p className="text-muted-foreground mt-2">Create and manage your blog posts</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => resetForm()}>
                <Plus className="mr-2 h-4 w-4" />
                New Blog Post
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingId ? 'Edit Blog Post' : 'Create New Blog Post'}
                </DialogTitle>
                <DialogDescription>
                  {editingId
                    ? 'Update your blog post details'
                    : 'Create a new blog post with rich content'}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Title *</label>
                  <Input
                    value={formData.title}
                    onChange={(e) => {
                      const title = e.target.value;
                      setFormData({
                        ...formData,
                        title,
                        slug: !editingId ? generateSlug(title) : formData.slug,
                      });
                    }}
                    placeholder="e.g., Getting Started with React"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Slug</label>
                  <Input
                    value={formData.slug}
                    onChange={(e) =>
                      setFormData({ ...formData, slug: e.target.value })
                    }
                    placeholder="e.g., getting-started-with-react"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Category *</label>
                    <Input
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                      }
                      placeholder="e.g., Web Development, Tutorial"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Author</label>
                    <Input
                      value={formData.author}
                      onChange={(e) =>
                        setFormData({ ...formData, author: e.target.value })
                      }
                      placeholder="e.g., Sachin"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Excerpt *</label>
                  <Textarea
                    value={formData.excerpt}
                    onChange={(e) =>
                      setFormData({ ...formData, excerpt: e.target.value })
                    }
                    placeholder="Brief summary of the blog post..."
                    rows={2}
                  />
                </div>
                <ImageInput
                  label="Featured Image"
                  value={formData.featuredImage}
                  onChange={(value) =>
                    setFormData({ ...formData, featuredImage: value })
                  }
                  placeholder="Featured image URL..."
                  preview
                />
                <div>
                  <label className="text-sm font-medium">Content *</label>
                  <Textarea
                    value={formData.content}
                    onChange={(e) =>
                      setFormData({ ...formData, content: e.target.value })
                    }
                    placeholder="Write your blog post content here... You can include markdown formatting, HTML, images, videos, and more."
                    rows={10}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    You can use HTML and markdown formatting. To embed media, paste image/video URLs directly or use HTML tags.
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Tags (comma separated)</label>
                  <Input
                    value={formData.tags.join(', ')}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        tags: e.target.value
                          .split(',')
                          .map((s) => s.trim())
                          .filter((s) => s),
                      })
                    }
                    placeholder="e.g., React, JavaScript, Web Development"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="published"
                    checked={formData.isPublished}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, isPublished: checked as boolean })
                    }
                  />
                  <label htmlFor="published" className="text-sm font-medium cursor-pointer">
                    Publish this blog post
                  </label>
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
            placeholder="Search by title or category..."
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
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Views</TableHead>
                <TableHead>Tags</TableHead>
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
              ) : filteredBlogs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4">
                    No blogs found
                  </TableCell>
                </TableRow>
              ) : (
                filteredBlogs.map((blog) => (
                  <TableRow key={blog._id}>
                    <TableCell className="font-medium">{blog.title}</TableCell>
                    <TableCell>{blog.category}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        blog.isPublished
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {blog.isPublished ? 'Published' : 'Draft'}
                      </span>
                    </TableCell>
                    <TableCell>{blog.viewCount}</TableCell>
                    <TableCell>{blog.tags.join(', ') || '-'}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(blog)}
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
                            <AlertDialogTitle>Delete Blog</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this blog post? This action cannot
                              be undone.
                            </AlertDialogDescription>
                            <div className="flex justify-end gap-2">
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(blog._id)}
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

export default AdminBlogs;
