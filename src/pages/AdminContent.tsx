import { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { api } from '@/lib/api';
import AdminLayout from '@/components/layout/AdminLayout';
import { useToast } from '@/hooks/use-toast';
import { X, Plus, ImagePlus } from 'lucide-react';
import { motion } from 'framer-motion';
import { ImageInput } from '@/components/AdminImageUpload';

interface ContentData {
  hero?: { title: string; subtitle: string; ctas: any[]; background_image?: string; image_url?: string };
  about?: { summary: string; highlights: string[]; background_image?: string };
  skills?: { frontend: string[]; backend: string[]; devops: string[]; background_image?: string };
  contact?: { email: string; phone: string; address: string; whatsapp_number: string };
  social?: { [key: string]: string };
  banners?: { items: any[] };
  backgrounds?: { hero?: string; about?: string; skills?: string; projects?: string };
}

const AdminContent = () => {
  const { toast } = useToast();
  const [content, setContent] = useState<ContentData>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);

  useEffect(() => {
    loadAllContent();
  }, []);

const loadAllContent = async () => {
  try {
    const keys = ['hero', 'about', 'skills', 'contact', 'social', 'banners', 'backgrounds'];

    const results = await Promise.all(
      keys.map(async (key) => {
        try {
          const data = await api.get(`/api/content/${key}`);
          return { [key]: data };
        } catch (error) {
          console.warn(`No content for ${key} yet`);
          if (key === 'banners') {
            return { banners: { items: [] } };
          }
          return { [key]: {} };
        }
      })
    );

    const merged = Object.assign({}, ...results);
    setContent(merged);
  } catch (error) {
    console.error('Error loading content:', error);
  } finally {
    setLoading(false);
  }
};


  const saveContent = async (key: string) => {
    setSaving(key);
    try {
      await api.put(`/api/admin/content/${key}`, content[key as keyof ContentData]);
      toast({
        title: 'Success',
        description: `${key} updated successfully`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to update ${key}`,
        variant: 'destructive',
      });
    } finally {
      setSaving(null);
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

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <AdminLayout>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6 max-w-4xl"
      >
        <div>
          <h1 className="text-3xl font-bold">Content Management</h1>
          <p className="text-muted-foreground mt-2">Edit your portfolio content sections</p>
        </div>

        <Tabs defaultValue="hero" className="w-full">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="hero">Hero</TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
            <TabsTrigger value="contact">Contact</TabsTrigger>
            <TabsTrigger value="social">Social</TabsTrigger>
            <TabsTrigger value="banners">Banners</TabsTrigger>
            <TabsTrigger value="backgrounds">Backgrounds</TabsTrigger>
          </TabsList>

          <TabsContent value="hero" className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Hero Section</CardTitle>
                  <CardDescription>Main landing section content and styling</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Title</label>
                    <Input
                      value={content.hero?.title || ''}
                      onChange={(e) =>
                        setContent((prev) => ({
                          ...prev,
                          hero: { ...prev.hero, title: e.target.value } as any,
                        }))
                      }
                      placeholder="e.g., Hi, I'm Sachin Takoria"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Subtitle</label>
                    <Input
                      value={content.hero?.subtitle || ''}
                      onChange={(e) =>
                        setContent((prev) => ({
                          ...prev,
                          hero: { ...prev.hero, subtitle: e.target.value } as any,
                        }))
                      }
                      placeholder="e.g., MERN Stack Web Developer"
                    />
                  </div>
                  <ImageInput
                    label="Hero Profile Image"
                    value={content.hero?.image_url || ''}
                    onChange={(value) =>
                      setContent((prev) => ({
                        ...prev,
                        hero: { ...prev.hero, image_url: value } as any,
                      }))
                    }
                    placeholder="https://images.unsplash.com/... (Your professional photo)"
                    preview
                  />
                  <ImageInput
                    label="Background Image URL"
                    value={content.hero?.background_image || ''}
                    onChange={(value) =>
                      setContent((prev) => ({
                        ...prev,
                        hero: { ...prev.hero, background_image: value } as any,
                      }))
                    }
                    placeholder="https://images.unsplash.com/..."
                    preview
                  />
                  <Button
                    onClick={() => saveContent('hero')}
                    disabled={saving === 'hero'}
                    className="w-full"
                  >
                    {saving === 'hero' ? 'Saving...' : 'Save Hero Section'}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="about" className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>About Section</CardTitle>
                  <CardDescription>Your professional summary and styling</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Summary</label>
                    <Textarea
                      value={content.about?.summary || ''}
                      onChange={(e) =>
                        setContent((prev) => ({
                          ...prev,
                          about: { ...prev.about, summary: e.target.value } as any,
                        }))
                      }
                      rows={4}
                      placeholder="Write a brief summary about yourself..."
                    />
                  </div>
                  <ImageInput
                    label="Background Image URL"
                    value={content.about?.background_image || ''}
                    onChange={(value) =>
                      setContent((prev) => ({
                        ...prev,
                        about: { ...prev.about, background_image: value } as any,
                      }))
                    }
                    placeholder="https://images.unsplash.com/..."
                    preview
                  />
                  <div>
                    <label className="text-sm font-medium mb-2 block">Highlights</label>
                    {(content.about?.highlights || []).map((highlight, idx) => (
                      <div key={idx} className="flex gap-2 mb-2">
                        <Input
                          value={highlight}
                          onChange={(e) => {
                            const newHighlights = [...(content.about?.highlights || [])];
                            newHighlights[idx] = e.target.value;
                            setContent((prev) => ({
                              ...prev,
                              about: { ...prev.about, highlights: newHighlights } as any,
                            }));
                          }}
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => {
                            const newHighlights = (content.about?.highlights || []).filter(
                              (_, i) => i !== idx
                            );
                            setContent((prev) => ({
                              ...prev,
                              about: { ...prev.about, highlights: newHighlights } as any,
                            }));
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
                        setContent((prev) => ({
                          ...prev,
                          about: {
                            ...prev.about,
                            highlights: [...(prev.about?.highlights || []), ''],
                          } as any,
                        }));
                      }}
                    >
                      <Plus size={16} className="mr-1" /> Add Highlight
                    </Button>
                  </div>
                  <Button
                    onClick={() => saveContent('about')}
                    disabled={saving === 'about'}
                    className="w-full"
                  >
                    {saving === 'about' ? 'Saving...' : 'Save About Section'}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="skills" className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Skills Section</CardTitle>
                  <CardDescription>Organize your skills by category and styling</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {['frontend', 'backend', 'devops'].map((category) => (
                    <div key={category}>
                      <h3 className="font-medium capitalize mb-3">{category}</h3>
                      {(content.skills?.[category as keyof typeof content.skills] || []).map(
                        (skill, idx) => (
                          <div key={idx} className="flex gap-2 mb-2">
                            <Input
                              value={skill}
                              onChange={(e) => {
                                const newSkills = [
                                  ...(content.skills?.[category as keyof typeof content.skills] || []),
                                ];
                                newSkills[idx] = e.target.value;
                                setContent((prev) => ({
                                  ...prev,
                                  skills: {
                                    ...prev.skills,
                                    [category]: newSkills,
                                  } as any,
                                }));
                              }}
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              onClick={() => {
                                const newSkills = (
                                  content.skills?.[category as keyof typeof content.skills] || []
                                ).filter((_, i) => i !== idx);
                                setContent((prev) => ({
                                  ...prev,
                                  skills: {
                                    ...prev.skills,
                                    [category]: newSkills,
                                  } as any,
                                }));
                              }}
                            >
                              <X size={16} />
                            </Button>
                          </div>
                        )
                      )}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setContent((prev) => ({
                            ...prev,
                            skills: {
                              ...prev.skills,
                              [category]: [
                                ...(prev.skills?.[category as keyof typeof prev.skills] || []),
                                '',
                              ],
                            } as any,
                          }));
                        }}
                      >
                        <Plus size={16} className="mr-1" /> Add Skill
                      </Button>
                    </div>
                  ))}
                  <ImageInput
                    label="Background Image URL"
                    value={content.skills?.background_image || ''}
                    onChange={(value) =>
                      setContent((prev) => ({
                        ...prev,
                        skills: { ...prev.skills, background_image: value } as any,
                      }))
                    }
                    placeholder="https://images.unsplash.com/..."
                    preview
                  />
                  <Button
                    onClick={() => saveContent('skills')}
                    disabled={saving === 'skills'}
                    className="w-full"
                  >
                    {saving === 'skills' ? 'Saving...' : 'Save Skills Section'}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="contact" className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                  <CardDescription>Your contact details displayed on the site</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Email</label>
                    <Input
                      type="email"
                      value={content.contact?.email || ''}
                      onChange={(e) =>
                        setContent((prev) => ({
                          ...prev,
                          contact: { ...prev.contact, email: e.target.value } as any,
                        }))
                      }
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Phone</label>
                    <Input
                      value={content.contact?.phone || ''}
                      onChange={(e) =>
                        setContent((prev) => ({
                          ...prev,
                          contact: { ...prev.contact, phone: e.target.value } as any,
                        }))
                      }
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Address</label>
                    <Input
                      value={content.contact?.address || ''}
                      onChange={(e) =>
                        setContent((prev) => ({
                          ...prev,
                          contact: { ...prev.contact, address: e.target.value } as any,
                        }))
                      }
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">WhatsApp Number</label>
                    <Input
                      value={content.contact?.whatsapp_number || ''}
                      onChange={(e) =>
                        setContent((prev) => ({
                          ...prev,
                          contact: { ...prev.contact, whatsapp_number: e.target.value } as any,
                        }))
                      }
                    />
                  </div>
                  <Button
                    onClick={() => saveContent('contact')}
                    disabled={saving === 'contact'}
                    className="w-full"
                  >
                    {saving === 'contact' ? 'Saving...' : 'Save Contact Info'}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="social" className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Social Links</CardTitle>
                  <CardDescription>Your social media profiles</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {['github', 'linkedin', 'twitter', 'instagram', 'facebook', 'youtube'].map(
                    (social) => (
                      <div key={social}>
                        <label className="text-sm font-medium capitalize">{social}</label>
                        <Input
                          type="url"
                          value={content.social?.[social] || ''}
                          onChange={(e) =>
                            setContent((prev) => ({
                              ...prev,
                              social: { ...prev.social, [social]: e.target.value } as any,
                            }))
                          }
                        />
                      </div>
                    )
                  )}
                  <Button
                    onClick={() => saveContent('social')}
                    disabled={saving === 'social'}
                    className="w-full"
                  >
                    {saving === 'social' ? 'Saving...' : 'Save Social Links'}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="banners" className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Banner Carousel</CardTitle>
                  <CardDescription>Manage carousel banners with images</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {(content.banners?.items || []).map((banner, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: idx * 0.1 }}
                    >
                      <Card className="p-4 border border-muted-foreground/20">
                        <div className="space-y-3">
                          <div>
                            <label className="text-sm font-medium">Image URL</label>
                            <Input
                              type="url"
                              value={banner.image_url || ''}
                              onChange={(e) => {
                                const newBanners = [...(content.banners?.items || [])];
                                newBanners[idx] = { ...banner, image_url: e.target.value };
                                setContent((prev) => ({
                                  ...prev,
                                  banners: { ...prev.banners, items: newBanners } as any,
                                }));
                              }}
                              placeholder="https://images.unsplash.com/..."
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium">Alt Text</label>
                            <Input
                              value={banner.alt || ''}
                              onChange={(e) => {
                                const newBanners = [...(content.banners?.items || [])];
                                newBanners[idx] = { ...banner, alt: e.target.value };
                                setContent((prev) => ({
                                  ...prev,
                                  banners: { ...prev.banners, items: newBanners } as any,
                                }));
                              }}
                              placeholder="Banner description"
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium">Link URL</label>
                            <Input
                              type="url"
                              value={banner.link_url || ''}
                              onChange={(e) => {
                                const newBanners = [...(content.banners?.items || [])];
                                newBanners[idx] = { ...banner, link_url: e.target.value };
                                setContent((prev) => ({
                                  ...prev,
                                  banners: { ...prev.banners, items: newBanners } as any,
                                }));
                              }}
                              placeholder="https://..."
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium">Display Order</label>
                            <Input
                              type="number"
                              value={banner.order || idx + 1}
                              onChange={(e) => {
                                const newBanners = [...(content.banners?.items || [])];
                                newBanners[idx] = { ...banner, order: parseInt(e.target.value) };
                                setContent((prev) => ({
                                  ...prev,
                                  banners: { ...prev.banners, items: newBanners } as any,
                                }));
                              }}
                              min="1"
                            />
                          </div>
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => {
                              const newBanners = (content.banners?.items || []).filter(
                                (_, i) => i !== idx
                              );
                              setContent((prev) => ({
                                ...prev,
                                banners: { ...prev.banners, items: newBanners } as any,
                              }));
                            }}
                          >
                            <X size={16} className="mr-1" /> Remove Banner
                          </Button>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setContent((prev) => ({
                        ...prev,
                        banners: {
                          ...prev.banners,
                          items: [
                            ...(prev.banners?.items || []),
                            {
                              image_url: '',
                              alt: '',
                              link_url: '',
                              order: (prev.banners?.items || []).length + 1,
                            },
                          ],
                        } as any,
                      }));
                    }}
                  >
                    <Plus size={16} className="mr-1" /> Add Banner
                  </Button>
                  <Button
                    onClick={() => saveContent('banners')}
                    disabled={saving === 'banners'}
                    className="w-full"
                  >
                    {saving === 'banners' ? 'Saving...' : 'Save Banners'}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="backgrounds" className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ImagePlus className="h-5 w-5" />
                    Section Background Images
                  </CardTitle>
                  <CardDescription>
                    Add background images to different sections of your portfolio
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <ImageInput
                    label="Hero Section Background"
                    value={content.backgrounds?.hero || ''}
                    onChange={(value) =>
                      setContent((prev) => ({
                        ...prev,
                        backgrounds: { ...prev.backgrounds, hero: value } as any,
                      }))
                    }
                    placeholder="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?..."
                    preview
                  />

                  <ImageInput
                    label="About Section Background"
                    value={content.backgrounds?.about || ''}
                    onChange={(value) =>
                      setContent((prev) => ({
                        ...prev,
                        backgrounds: { ...prev.backgrounds, about: value } as any,
                      }))
                    }
                    placeholder="https://images.unsplash.com/..."
                    preview
                  />

                  <ImageInput
                    label="Skills Section Background"
                    value={content.backgrounds?.skills || ''}
                    onChange={(value) =>
                      setContent((prev) => ({
                        ...prev,
                        backgrounds: { ...prev.backgrounds, skills: value } as any,
                      }))
                    }
                    placeholder="https://images.unsplash.com/..."
                    preview
                  />

                  <ImageInput
                    label="Projects Section Background"
                    value={content.backgrounds?.projects || ''}
                    onChange={(value) =>
                      setContent((prev) => ({
                        ...prev,
                        backgrounds: { ...prev.backgrounds, projects: value } as any,
                      }))
                    }
                    placeholder="https://images.unsplash.com/..."
                    preview
                  />

                  <Button
                    onClick={() => saveContent('backgrounds')}
                    disabled={saving === 'backgrounds'}
                    className="w-full"
                  >
                    {saving === 'backgrounds' ? 'Saving...' : 'Save All Backgrounds'}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </AdminLayout>
  );
};

export default AdminContent;
