import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import PageLayout from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Github } from "lucide-react";
import { Link } from "react-router-dom";
// ⬇️ Supabase removed; using your REST API helper
import { api } from "@/lib/api";

type Project = {
  _id?: string;
  title: string;
  slug: string;
  short_description: string;
  tech_stack?: string[];
  category?: string;
  cover_image_url?: string;
  github_url?: string;
  live_url?: string;
  is_featured?: boolean;
  display_order?: number;
};

const Projects = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const {
    data: projects = [],
    isLoading,
    isError,
  } = useQuery<Project[]>({
    queryKey: ["projects"],
    queryFn: () => api.get<Project[]>("/api/projects"),
  });

  const categories = useMemo(() => {
    const set = new Set<string>();
    projects.forEach((p) => set.add(p.category || "Other"));
    return ["All", ...Array.from(set)];
  }, [projects]);

  const filteredProjects = useMemo(() => {
    if (selectedCategory === "All") return projects;
    return projects.filter(
      (p) => (p.category || "Other") === selectedCategory
    );
  }, [projects, selectedCategory]);

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Projects</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A showcase of my work and accomplishments
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-wrap gap-2 justify-center mb-12"
        >
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => setSelectedCategory(category)}
              className="transition-all"
            >
              {category}
            </Button>
          ))}
        </motion.div>

        {/* Projects Grid */}
        {isLoading ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground">Loading projects...</p>
          </div>
        ) : isError ? (
          <div className="text-center py-20">
            <p className="text-red-500">Failed to load projects.</p>
          </div>
        ) : filteredProjects.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.slug || project._id || index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.07 }}
                viewport={{ once: true }}
                whileHover={{ y: -8 }}
                className="group"
              >
                <div className="h-full rounded-lg border border-border bg-card overflow-hidden transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10">
                  {/* Image */}
                  <div className="aspect-video overflow-hidden bg-muted">
                    {project.cover_image_url ? (
                      <img
                        src={project.cover_image_url}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-sm text-muted-foreground">
                        No preview
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6 space-y-4">
                    <div>
                      <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                        {project.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {project.short_description}
                      </p>
                    </div>

                    {/* Tech Stack */}
                    <div className="flex flex-wrap gap-2">
                      {(project.tech_stack || []).slice(0, 3).map((tech) => (
                        <Badge key={tech} variant="secondary" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                      {project.tech_stack && project.tech_stack.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{project.tech_stack.length - 3}
                        </Badge>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                      <Link to={`/projects/${project.slug}`} className="flex-1">
                        <Button variant="default" className="w-full" size="sm">
                          View Details
                        </Button>
                      </Link>
                      {project.live_url && (
                        <a
                          href={project.live_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="Open live site"
                        >
                          <Button variant="outline" size="sm">
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </a>
                      )}
                      {project.github_url && (
                        <a
                          href={project.github_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="Open GitHub repo"
                        >
                          <Button variant="outline" size="sm">
                            <Github className="h-4 w-4" />
                          </Button>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-muted-foreground">No projects found in this category.</p>
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default Projects;
