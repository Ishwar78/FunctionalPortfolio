import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Code2, Sparkles, ExternalLink, Github, Star, Smartphone, Globe, Zap, Package, Settings, Database } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import PageLayout from "@/components/layout/PageLayout";
import { api } from "@/lib/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, Award, BookOpen } from "lucide-react";

interface HeroContent {
  title?: string;
  subtitle?: string;
  ctas?: Array<{ text: string; href: string }>;
  background_image?: string;
  image_url?: string;
}

interface AboutContent {
  summary?: string;
  highlights?: string[];
  background_image?: string;
}

interface SkillsContent {
  frontend?: string[];
  backend?: string[];
  devops?: string[];
  background_image?: string;
}

interface BannerContent {
  items?: Array<{
    image_url: string;
    alt: string;
    link_url: string;
    order: number;
  }>;
}

interface BackgroundsContent {
  hero?: string;
  about?: string;
  skills?: string;
  projects?: string;
}

const Home = () => {
  const [heroContent, setHeroContent] = useState<HeroContent>({});
  const [aboutContent, setAboutContent] = useState<AboutContent>({});
  const [skillsContent, setSkillsContent] = useState<SkillsContent>({});
  const [bannersContent, setBannersContent] = useState<BannerContent>({});
  const [backgroundsContent, setBackgroundsContent] = useState<BackgroundsContent>({});
  const [currentBanner, setCurrentBanner] = useState(0);

  useEffect(() => {
    const loadContent = async () => {
      try {
        const [hero, about, skills, banners, backgrounds] = await Promise.all([
          api.get<HeroContent>("/api/content/hero").catch(() => ({})),
          api.get<AboutContent>("/api/content/about").catch(() => ({})),
          api.get<SkillsContent>("/api/content/skills").catch(() => ({})),
          api.get<BannerContent>("/api/content/banners").catch(() => ({})),
          api.get<BackgroundsContent>("/api/content/backgrounds").catch(() => ({})),
        ]);
        setHeroContent(hero);
        setAboutContent(about);
        setSkillsContent(skills);
        setBannersContent(banners);
        setBackgroundsContent(backgrounds);
      } catch (error) {
        console.error("Failed to load content:", error);
      }
    };
    loadContent();
  }, []);

  const {
    data: projects = [],
  } = useQuery({
    queryKey: ["projects"],
    queryFn: () => api.get("/api/projects"),
  });

  const featuredProjects = projects.filter((p: any) => p.is_featured).slice(0, 3);
  const allTechs = [
    ...(skillsContent.frontend || []),
    ...(skillsContent.backend || []),
  ].filter((t, i, arr) => arr.indexOf(t) === i);

  const bannerItems = bannersContent.items?.sort((a, b) => a.order - b.order) || [];

  useEffect(() => {
    if (bannerItems.length > 0) {
      const timer = setInterval(() => {
        setCurrentBanner((prev) => (prev + 1) % bannerItems.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [bannerItems.length]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <PageLayout>
      <div className="relative overflow-hidden">
        {/* Hero Section */}
        <section
          className="container mx-auto px-4 py-20 md:py-32 relative"
          style={{
            backgroundImage: backgroundsContent.hero
              ? `url(${backgroundsContent.hero})`
              : undefined,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundAttachment: "fixed",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-background/95 via-background/80 to-background/95 pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
            {/* Animated Background Elements */}
            <motion.div
              className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{ duration: 8, repeat: Infinity }}
            />
            <motion.div
              className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl"
              animate={{
                scale: [1.2, 1, 1.2],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{ duration: 10, repeat: Infinity }}
            />

            {/* Left Side - Text Content */}
            <div className="flex flex-col space-y-8">
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative w-fit"
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/5 backdrop-blur-sm">
                  <Sparkles className="h-4 w-4 text-primary animate-spin" />
                  <span className="text-sm font-medium">Available for Projects</span>
                </div>
              </motion.div>

              {/* Heading */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="space-y-4 relative z-10"
              >
                <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                  {heroContent.title || "Sachin Takoria"}
                </h1>
                <p className="text-xl md:text-2xl text-muted-foreground">
                  {heroContent.subtitle || "MERN Stack Web Developer"}
                </p>
              </motion.div>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex flex-col sm:flex-row gap-4 relative z-10"
              >
                {heroContent.ctas ? (
                  heroContent.ctas.map((cta: any, index) => (
                    <Link key={index} to={cta.href}>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button
                          size="lg"
                          variant={index === 0 ? "default" : "outline"}
                          className={index === 0 ? "group" : ""}
                        >
                          {cta.text}
                          {index === 0 && (
                            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                          )}
                        </Button>
                      </motion.div>
                    </Link>
                  ))
                ) : (
                  <>
                    <Link to="/projects">
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button size="lg" className="group">
                          View Projects
                          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </motion.div>
                    </Link>
                    <Link to="/contact">
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button size="lg" variant="outline">
                          Contact Me
                        </Button>
                      </motion.div>
                    </Link>
                  </>
                )}
              </motion.div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="grid grid-cols-3 gap-8 pt-8 relative z-10"
            >
                <motion.div whileHover={{ scale: 1.1 }} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-primary">1+</div>
                  <div className="text-sm text-muted-foreground">Year Experience</div>
                </motion.div>
                <motion.div whileHover={{ scale: 1.1 }} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-primary">{projects.length}+</div>
                  <div className="text-sm text-muted-foreground">Projects Built</div>
                </motion.div>
                <motion.div whileHover={{ scale: 1.1 }} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-primary">100%</div>
                  <div className="text-sm text-muted-foreground">Client Satisfaction</div>
                </motion.div>
              </motion.div>
            </div>

            {/* Right Side - Hero Image */}
            {heroContent.image_url && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, x: 20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="relative h-full flex items-center justify-center"
              >
                <div className="relative w-full aspect-square max-w-lg">
                  {/* Glow effect background */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl blur-3xl"
                    animate={{
                      scale: [1, 1.1, 1],
                      opacity: [0.5, 0.8, 0.5],
                    }}
                    transition={{ duration: 5, repeat: Infinity }}
                  />

                  {/* Image container */}
                  <div className="relative z-10 w-full h-full rounded-2xl overflow-hidden border-2 border-primary/20 shadow-2xl">
                    <img
                      src={heroContent.image_url}
                      alt="Professional profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </section>

        {/* Featured Projects Section */}
        {featuredProjects.length > 0 && (
          <section
            className="container mx-auto px-4 py-20 relative"
            style={{
              backgroundImage: backgroundsContent.projects
                ? `url(${backgroundsContent.projects})`
                : undefined,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundAttachment: "fixed",
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-background/95 via-background/90 to-background/95 pointer-events-none" />

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="relative z-10"
            >
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="text-center mb-16"
              >
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Projects</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Explore a selection of my most impactful projects built with modern technologies, clean code, and a focus on delivering exceptional user experiences
                </p>
              </motion.div>

              <div className="grid md:grid-cols-3 gap-8">
                {featuredProjects.map((project: any, index: number) => (
                  <motion.div
                    key={project._id}
                    variants={itemVariants}
                    whileHover={{ y: -10 }}
                    className="group rounded-lg overflow-hidden border border-border bg-card hover:border-primary/50 transition-all"
                  >
                    {/* Project Image */}
                    {project.cover_image_url && (
                      <div className="relative h-48 overflow-hidden bg-muted">
                        <motion.img
                          src={project.cover_image_url}
                          alt={project.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          whileHover={{ scale: 1.1 }}
                          onError={(e: any) => {
                            e.target.src =
                              "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&h=300&fit=crop";
                          }}
                        />
                      </div>
                    )}

                    {/* Project Content */}
                    <div className="p-6 space-y-4">
                      <div>
                        <h3 className="text-xl font-bold group-hover:text-primary transition-colors">
                          {project.title}
                        </h3>
                        {project.category && (
                          <p className="text-sm text-muted-foreground mt-1">{project.category}</p>
                        )}
                      </div>

                      <p className="text-muted-foreground line-clamp-2">
                        {project.short_description}
                      </p>

                      {/* Tech Stack */}
                      {project.tech_stack && project.tech_stack.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {project.tech_stack.slice(0, 3).map((tech: string) => (
                            <motion.span
                              key={tech}
                              whileHover={{ scale: 1.1 }}
                              className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20"
                            >
                              {tech}
                            </motion.span>
                          ))}
                          {project.tech_stack.length > 3 && (
                            <span className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                              +{project.tech_stack.length - 3}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex gap-3 pt-4">
                        <Link to={`/projects/${project.slug}`} className="flex-1">
                          <Button size="sm" variant="outline" className="w-full">
                            View Details
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </Link>
                        {project.github_url && (
                          <a
                            href={project.github_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1"
                          >
                            <Button size="sm" variant="ghost" className="w-full">
                              <Github className="h-4 w-4" />
                            </Button>
                          </a>
                        )}
                        {project.demo_url && (
                          <a
                            href={project.demo_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1"
                          >
                            <Button size="sm" variant="ghost" className="w-full">
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          </a>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </section>
        )}

        {/* Services Section */}
        <section className="container mx-auto px-4 py-20 relative">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">What I Can Build</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Comprehensive development solutions for diverse business needs - from web apps to enterprise systems
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Web Development */}
              <motion.div
                variants={itemVariants}
                whileHover={{ y: -5, borderColor: 'hsl(var(--primary))' }}
                className="p-6 rounded-xl border border-border bg-card/50 backdrop-blur hover:shadow-lg transition-all"
              >
                <div className="p-3 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 w-fit mb-4">
                  <Globe className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-bold mb-2">Web Development</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Modern, responsive websites and web applications using React, Node.js, and MongoDB. Fast, secure, and scalable solutions.
                </p>
              </motion.div>

              {/* Mobile App Development */}
              <motion.div
                variants={itemVariants}
                whileHover={{ y: -5, borderColor: 'hsl(var(--accent))' }}
                className="p-6 rounded-xl border border-border bg-card/50 backdrop-blur hover:shadow-lg transition-all"
              >
                <div className="p-3 rounded-lg bg-gradient-to-br from-accent/20 to-accent/10 w-fit mb-4">
                  <Smartphone className="h-6 w-6 text-accent" />
                </div>
                <h3 className="text-lg font-bold mb-2">App Development</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Full-featured mobile applications with intuitive interfaces, offline capabilities, and seamless API integration.
                </p>
              </motion.div>

              {/* SaaS Solutions */}
              <motion.div
                variants={itemVariants}
                whileHover={{ y: -5 }}
                className="p-6 rounded-xl border border-border bg-card/50 backdrop-blur hover:shadow-lg transition-all"
              >
                <div className="p-3 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 w-fit mb-4">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-bold mb-2">SaaS Platforms</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Multi-tenant SaaS applications with subscription management, user authentication, and advanced analytics dashboards.
                </p>
              </motion.div>

              {/* Inventory Management */}
              <motion.div
                variants={itemVariants}
                whileHover={{ y: -5, borderColor: 'hsl(var(--accent))' }}
                className="p-6 rounded-xl border border-border bg-card/50 backdrop-blur hover:shadow-lg transition-all"
              >
                <div className="p-3 rounded-lg bg-gradient-to-br from-accent/20 to-accent/10 w-fit mb-4">
                  <Package className="h-6 w-6 text-accent" />
                </div>
                <h3 className="text-lg font-bold mb-2">Inventory Management</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Complete inventory tracking systems with stock management, barcode scanning, and real-time reporting capabilities.
                </p>
              </motion.div>

              {/* ERP Systems */}
              <motion.div
                variants={itemVariants}
                whileHover={{ y: -5 }}
                className="p-6 rounded-xl border border-border bg-card/50 backdrop-blur hover:shadow-lg transition-all"
              >
                <div className="p-3 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 w-fit mb-4">
                  <Settings className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-bold mb-2">ERP Systems</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Enterprise Resource Planning solutions integrating finance, HR, operations, and supply chain management.
                </p>
              </motion.div>

              {/* Database & API */}
              <motion.div
                variants={itemVariants}
                whileHover={{ y: -5, borderColor: 'hsl(var(--accent))' }}
                className="p-6 rounded-xl border border-border bg-card/50 backdrop-blur hover:shadow-lg transition-all"
              >
                <div className="p-3 rounded-lg bg-gradient-to-br from-accent/20 to-accent/10 w-fit mb-4">
                  <Database className="h-6 w-6 text-accent" />
                </div>
                <h3 className="text-lg font-bold mb-2">Database & APIs</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Robust database design, REST APIs, GraphQL, and integration solutions for seamless data flow across systems.
                </p>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              className="text-center mt-12"
            >
              <p className="text-muted-foreground mb-4 max-w-2xl mx-auto">
                Not seeing what you need? I'm flexible and can build custom solutions tailored to your specific requirements.
              </p>
              <Link to="/contact">
                <Button size="lg" className="gap-2">
                  Discuss Your Project
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </section>

        {/* Banner Carousel Section */}
        {bannerItems.length > 0 && (
          <section className="container mx-auto px-4 py-12">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="relative h-64 md:h-96 overflow-hidden rounded-lg"
            >
              {bannerItems.map((banner, index) => (
                <motion.a
                  key={index}
                  href={banner.link_url || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute inset-0"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: currentBanner === index ? 1 : 0 }}
                  transition={{ duration: 0.5 }}
                  style={{ pointerEvents: currentBanner === index ? "auto" : "none" }}
                >
                  <img
                    src={banner.image_url}
                    alt={banner.alt}
                    className="w-full h-full object-cover"
                    onError={(e: any) => {
                      e.target.src =
                        "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&h=500&fit=crop";
                    }}
                  />
                </motion.a>
              ))}

              {/* Carousel Controls */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
                {bannerItems.map((_, index) => (
                  <motion.button
                    key={index}
                    className={`h-2 rounded-full transition-all ${
                      currentBanner === index ? "bg-white w-8" : "bg-white/50 w-2"
                    }`}
                    whileHover={{ scale: 1.2 }}
                    onClick={() => setCurrentBanner(index)}
                  />
                ))}
              </div>
            </motion.div>
          </section>
        )}

        {/* About Section */}
        <section
          className="container mx-auto px-4 py-20 relative"
          style={{
            backgroundImage: backgroundsContent.about
              ? `url(${backgroundsContent.about})`
              : undefined,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundAttachment: "fixed",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-background/95 via-background/90 to-background/95 pointer-events-none" />

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="max-w-4xl mx-auto relative z-10"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">About Me</h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8 text-center">
              {aboutContent.summary || "I'm a passionate MERN Stack developer with 1+ year of experience building scalable, modern web applications. I specialize in creating efficient, secure, and user-friendly solutions that solve real-world problems."}
            </p>

            {aboutContent.highlights && aboutContent.highlights.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {aboutContent.highlights.map((highlight, index) => (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    className="flex items-center gap-3 p-4 rounded-lg border border-border bg-card/50"
                  >
                    <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary" />
                    <p>{highlight}</p>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <motion.div
                  variants={itemVariants}
                  className="flex items-center gap-3 p-4 rounded-lg border border-border bg-card/50"
                >
                  <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary" />
                  <p>Full-stack expertise in MongoDB, Express, React, and Node.js</p>
                </motion.div>
                <motion.div
                  variants={itemVariants}
                  className="flex items-center gap-3 p-4 rounded-lg border border-border bg-card/50"
                >
                  <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary" />
                  <p>Proven track record of delivering quality projects on time</p>
                </motion.div>
                <motion.div
                  variants={itemVariants}
                  className="flex items-center gap-3 p-4 rounded-lg border border-border bg-card/50"
                >
                  <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary" />
                  <p>Clean code practices and attention to detail</p>
                </motion.div>
                <motion.div
                  variants={itemVariants}
                  className="flex items-center gap-3 p-4 rounded-lg border border-border bg-card/50"
                >
                  <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary" />
                  <p>Strong communication and collaborative problem-solving</p>
                </motion.div>
              </div>
            )}

            <div className="mt-8 text-center">
              <Link to="/about">
                <Button size="lg" variant="outline" className="gap-2">
                  Learn More About Me
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </section>

        {/* Tech Stack Section */}
        <section
          className="container mx-auto px-4 py-20 relative"
          style={{
            backgroundImage: backgroundsContent.skills
              ? `url(${backgroundsContent.skills})`
              : undefined,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundAttachment: "fixed",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-background/95 via-background/90 to-background/95 pointer-events-none" />

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="relative z-10"
          >
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Tech Stack & Skills</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Modern technologies and tools I use to build high-quality applications
              </p>
            </motion.div>

            {allTechs.length > 0 ? (
              <div className="flex flex-wrap justify-center gap-3 mb-8">
                {allTechs.map((tech, index) => (
                  <motion.div
                    key={tech}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.1, y: -5 }}
                    transition={{ delay: index * 0.05 }}
                    viewport={{ once: true }}
                    className="px-4 py-2 rounded-full border border-primary/20 bg-primary/5 backdrop-blur-sm hover:bg-primary/10 transition-all"
                  >
                    {tech}
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="flex flex-wrap justify-center gap-3 mb-8">
                {['React', 'TypeScript', 'Node.js', 'Express', 'MongoDB', 'Tailwind CSS', 'REST APIs', 'JWT', 'Git', 'Linux', 'Nginx'].map((tech, index) => (
                  <motion.div
                    key={tech}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.1, y: -5 }}
                    transition={{ delay: index * 0.05 }}
                    viewport={{ once: true }}
                    className="px-4 py-2 rounded-full border border-primary/20 bg-primary/5 backdrop-blur-sm hover:bg-primary/10 transition-all"
                  >
                    {tech}
                  </motion.div>
                ))}
              </div>
            )}

            <div className="text-center">
              <Link to="/skills">
                <Button size="lg" variant="outline" className="gap-2">
                  View Complete Skill Set
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </section>

        {/* Experience Section */}
        <section className="container mx-auto px-4 py-20 relative">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Professional Experience</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                My journey in software development with diverse roles and responsibilities
              </p>
            </motion.div>

            <div className="text-center">
              <Link to="/experience">
                <Button size="lg" variant="outline" className="gap-2">
                  View My Experience
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </section>

        {/* Certifications Section */}
        <section className="container mx-auto px-4 py-20 relative">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Certifications & Training</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Professional certifications and training courses I have completed
              </p>
            </motion.div>

            <div className="text-center">
              <Link to="/certifications">
                <Button size="lg" variant="outline" className="gap-2">
                  View Certifications
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </section>

        {/* Blog Section */}
        <section className="container mx-auto px-4 py-20 relative">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Latest Blog Posts</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Articles, tutorials, and insights about web development and technology
              </p>
            </motion.div>

            <div className="text-center">
              <Link to="/blogs">
                <Button size="lg" variant="outline" className="gap-2">
                  Explore All Blog Posts
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 rounded-2xl blur-xl" />

            <div className="relative p-8 md:p-16 rounded-2xl border border-border/50 bg-card/50 backdrop-blur text-center space-y-6">
              <h2 className="text-3xl md:text-5xl font-bold">Ready to Build Something Great?</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Whether you have a specific project in mind or just want to explore possibilities,
                I'm excited to discuss how I can help bring your vision to life.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Link to="/contact">
                  <Button size="lg" className="group">
                    Start a Project
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link to="/projects">
                  <Button size="lg" variant="outline" className="group">
                    View My Work
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </section>
      </div>
    </PageLayout>
  );
};

export default Home;
