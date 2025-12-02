import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { api } from '@/lib/api';
import PageLayout from '@/components/layout/PageLayout';
import { motion } from 'framer-motion';
import { Calendar, Eye, ArrowRight } from 'lucide-react';

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

const BlogsPage = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [filteredBlogs, setFilteredBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    loadBlogs();
  }, []);

  const loadBlogs = async () => {
    try {
      const data = await api.get<Blog[]>('/api/blogs?published=true');
      const publishedBlogs = data.filter((b) => b.isPublished);
      setBlogs(publishedBlogs);
      setFilteredBlogs(publishedBlogs);

      const uniqueCategories = Array.from(
        new Set(publishedBlogs.map((b) => b.category))
      ).sort();
      setCategories(uniqueCategories);
    } catch (error) {
      console.error('Failed to load blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    filterBlogs();
  }, [searchTerm, selectedCategory, blogs]);

  const filterBlogs = () => {
    let filtered = blogs;

    if (searchTerm) {
      filtered = filtered.filter(
        (b) =>
          b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          b.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
          b.tags.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter((b) => b.category === selectedCategory);
    }

    setFilteredBlogs(filtered);
  };

  const formatDate = (date: string) => {
    try {
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return date;
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <PageLayout title="Blogs" description="Articles, tutorials, and insights">
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 py-12 px-4">
        <motion.div
          className="max-w-5xl mx-auto space-y-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Blog</h1>
            <p className="text-lg text-muted-foreground">
              Articles, tutorials, and insights about web development and technology
            </p>
          </div>

          <div className="space-y-4">
            <Input
              type="search"
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md"
            />

            {categories.length > 0 && (
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={selectedCategory === '' ? 'default' : 'outline'}
                  onClick={() => setSelectedCategory('')}
                  size="sm"
                >
                  All Categories
                </Button>
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? 'default' : 'outline'}
                    onClick={() => setSelectedCategory(category)}
                    size="sm"
                  >
                    {category}
                  </Button>
                ))}
              </div>
            )}
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-muted-foreground">Loading blogs...</p>
            </div>
          ) : filteredBlogs.length === 0 ? (
            <Card>
              <CardContent className="py-12">
                <p className="text-center text-muted-foreground">
                  {searchTerm || selectedCategory
                    ? 'No blogs found matching your search'
                    : 'No blog posts yet'}
                </p>
              </CardContent>
            </Card>
          ) : (
            <motion.div className="space-y-6" variants={containerVariants}>
              {filteredBlogs.map((blog) => (
                <motion.div key={blog._id} variants={itemVariants}>
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow group">
                    <div className="grid md:grid-cols-3 gap-6 h-full">
                      {blog.featuredImage && (
                        <div className="overflow-hidden md:col-span-1">
                          <img
                            src={blog.featuredImage}
                            alt={blog.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        </div>
                      )}
                      <div className={`${blog.featuredImage ? 'md:col-span-2' : ''}`}>
                        <CardHeader>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
                              <Calendar className="w-4 h-4" />
                              <span>{formatDate(blog.publishedAt)}</span>
                              <span>•</span>
                              <span className="bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-slate-100 text-xs font-medium px-2 py-1 rounded">
                                {blog.category}
                              </span>
                              {blog.viewCount > 0 && (
                                <>
                                  <span>•</span>
                                  <div className="flex items-center gap-1">
                                    <Eye className="w-4 h-4" />
                                    <span>{blog.viewCount} views</span>
                                  </div>
                                </>
                              )}
                            </div>
                            <CardTitle className="text-2xl">{blog.title}</CardTitle>
                            <CardDescription className="text-base">
                              {blog.excerpt}
                            </CardDescription>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {blog.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {blog.tags.map((tag) => (
                                <span
                                  key={tag}
                                  className="bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-slate-100 text-xs font-medium px-2 py-1 rounded"
                                >
                                  #{tag}
                                </span>
                              ))}
                            </div>
                          )}
                          <Link to={`/blog/${blog.slug}`}>
                            <Button
                              variant="outline"
                              className="gap-2 group/btn"
                            >
                              Read More
                              <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                            </Button>
                          </Link>
                        </CardContent>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </motion.div>
      </div>
    </PageLayout>
  );
};

export default BlogsPage;
