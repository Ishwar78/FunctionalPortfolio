import { motion } from "framer-motion";
import PageLayout from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Github, ArrowLeft } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import ReactMarkdown from "react-markdown";
// ⬇️ Supabase removed; using your REST API helper
import { api } from "@/lib/api";

type Project = {
  _id?: string;
  title: string;
  slug: string;
  short_description: string;
  detailed_description?: string;
  readme_content?: string;
  tech_stack?: string[];
  category?: string;
  cover_image_url?: string;
  github_url?: string;
  live_url?: string;
  is_featured?: boolean;
};

const ProjectDetail = () => {
  const { slug } = useParams<{ slug: string }>();

  const {
    data: project,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["project", slug],
    queryFn: async () => api.get<Project>(`/api/projects/${slug}`),
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <PageLayout>
        <div className="container mx-auto px-4 py-20 text-center">
          <p className="text-muted-foreground">Loading project...</p>
        </div>
      </PageLayout>
    );
  }

  if (isError || !project) {
    return (
      <PageLayout>
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Project Not Found</h1>
          <Link to="/projects">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Projects
            </Button>
          </Link>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-20">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-8"
        >
          <Link to="/projects">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Projects
            </Button>
          </Link>
        </motion.div>

        {/* Project Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            <div className="flex-1 space-y-6">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                  {project.title}
                </h1>
                <p className="text-xl text-muted-foreground">
                  {project.short_description}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">{project.category || "Other"}</Badge>
                {project.is_featured && (
                  <Badge className="bg-gradient-to-r from-primary to-accent">
                    Featured
                  </Badge>
                )}
              </div>

              <div className="flex flex-wrap gap-3">
                {project.live_url && (
                  <a
                    href={project.live_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button>
                      <ExternalLink className="mr-2 h-4 w-4" />
                      View Live
                    </Button>
                  </a>
                )}
                {project.github_url && (
                  <a
                    href={project.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="outline">
                      <Github className="mr-2 h-4 w-4" />
                      View Code
                    </Button>
                  </a>
                )}
              </div>
            </div>

            {/* Cover Image */}
            {project.cover_image_url && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="lg:w-1/2"
              >
                <img
                  src={project.cover_image_url}
                  alt={project.title}
                  className="w-full rounded-lg border border-border shadow-xl"
                  loading="lazy"
                />
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Tech Stack */}
        {project.tech_stack && project.tech_stack.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <h2 className="text-2xl font-bold mb-4">Tech Stack</h2>
            <div className="flex flex-wrap gap-2">
              {project.tech_stack.map((tech) => (
                <Badge key={tech} variant="secondary" className="px-4 py-2 text-sm">
                  {tech}
                </Badge>
              ))}
            </div>
          </motion.div>
        )}

        {/* Description */}
        {(project.detailed_description || project.short_description) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <h2 className="text-2xl font-bold mb-4">Overview</h2>
            <p className="text-muted-foreground leading-relaxed">
              {project.detailed_description || project.short_description}
            </p>
          </motion.div>
        )}

        {/* README Content */}
        {project.readme_content && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="prose prose-invert max-w-none"
          >
            <h2 className="text-2xl font-bold mb-4">Details</h2>
            <div className="p-6 rounded-lg border border-border bg-card">
              <ReactMarkdown
                components={{
                  h1: ({ children }) => (
                    <h1 className="text-3xl font-bold mt-8 mb-4">{children}</h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="text-2xl font-bold mt-6 mb-3">{children}</h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-xl font-bold mt-4 mb-2">{children}</h3>
                  ),
                  p: ({ children }) => (
                    <p className="mb-4 text-muted-foreground leading-relaxed">
                      {children}
                    </p>
                  ),
                  ul: ({ children }) => (
                    <ul className="list-disc list-inside mb-4 space-y-2">
                      {children}
                    </ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="list-decimal list-inside mb-4 space-y-2">
                      {children}
                    </ol>
                  ),
                  li: ({ children }) => (
                    <li className="text-muted-foreground">{children}</li>
                  ),
                  a: ({ href, children }) => (
                    <a
                      href={href as string}
                      className="text-primary hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {children}
                    </a>
                  ),
                  img: ({ src, alt }) => (
                    <img
                      src={src as string}
                      alt={alt as string}
                      className="rounded-lg my-4 border border-border"
                    />
                  ),
                }}
              >
                {project.readme_content}
              </ReactMarkdown>
            </div>
          </motion.div>
        )}
      </div>
    </PageLayout>
  );
};

export default ProjectDetail;
