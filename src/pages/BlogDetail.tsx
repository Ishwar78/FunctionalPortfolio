import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
import PageLayout from '@/components/layout/PageLayout';
import { motion } from 'framer-motion';
import { Calendar, Eye, ArrowLeft, Share2 } from 'lucide-react';

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

const BlogDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    loadBlog();
  }, [slug]);

  const loadBlog = async () => {
    try {
      if (!slug) {
        setError(true);
        return;
      }
      const data = await api.get<Blog>(`/api/blogs/${slug}`);
      setBlog(data);
    } catch (err) {
      console.error('Failed to load blog:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: string) => {
    try {
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return date;
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: blog?.title,
        text: blog?.excerpt,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  if (loading) {
    return (
      <PageLayout title="Blog" description="Loading...">
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-muted-foreground">Loading blog...</p>
        </div>
      </PageLayout>
    );
  }

  if (error || !blog) {
    return (
      <PageLayout title="Blog Not Found" description="The blog post could not be found">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Blog Not Found</h1>
            <p className="text-muted-foreground mb-6">The blog post you're looking for doesn't exist.</p>
            <Link to="/blogs">
              <Button className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Blogs
              </Button>
            </Link>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout title={blog.title} description={blog.excerpt}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 py-12 px-4">
        <motion.div
          className="max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link to="/blogs" className="inline-block mb-6">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Blogs
            </Button>
          </Link>

          <article>
            {blog.featuredImage && (
              <div className="mb-8 rounded-lg overflow-hidden h-96">
                <img
                  src={blog.featuredImage}
                  alt={blog.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <Card className="mb-8">
              <CardHeader>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap mb-3">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(blog.publishedAt)}</span>
                      <span>•</span>
                      <span className="bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-slate-100 text-xs font-medium px-2 py-1 rounded">
                        {blog.category}
                      </span>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        <span>{blog.viewCount} views</span>
                      </div>
                    </div>
                    <CardTitle className="text-4xl md:text-5xl">{blog.title}</CardTitle>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div>
                      <p className="text-sm font-medium">By {blog.author}</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleShare}
                      className="gap-2"
                    >
                      <Share2 className="w-4 h-4" />
                      Share
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {blog.tags.length > 0 && (
              <div className="mb-8 flex flex-wrap gap-2">
                {blog.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-slate-100 text-xs font-medium px-3 py-1 rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            <Card>
              <CardContent className="py-8">
                <div className="prose dark:prose-invert max-w-none">
                  <div
                    className="text-lg leading-relaxed space-y-4"
                    dangerouslySetInnerHTML={{ __html: blog.content }}
                  />
                </div>
              </CardContent>
            </Card>

            <div className="mt-12 pt-8 border-t">
              <Link to="/blogs">
                <Button variant="outline" className="gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Back to All Posts
                </Button>
              </Link>
            </div>
          </article>
        </motion.div>
      </div>
    </PageLayout>
  );
};

export default BlogDetail;
