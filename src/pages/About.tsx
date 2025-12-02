import { motion } from "framer-motion";
import PageLayout from "@/components/layout/PageLayout";
import { Briefcase, GraduationCap, MapPin, Award, Target, Lightbulb, Heart, Code2, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const About = () => {
  const experiences = [
    {
      title: "MERN Stack Web Developer",
      company: "Satya Web Technology",
      period: "Aug 2024 – Present",
      location: "Rohtak, Haryana",
      description: "Building full-stack web applications using MongoDB, Express, React, and Node.js. Implementing authentication systems, REST APIs, and deployment solutions.",
    },
    {
      title: "Full Stack Developer Intern",
      company: "CODE PLUS IT Services",
      period: "Mar 2024 – Oct 2024",
      location: "Rohtak, Haryana",
      description: "Developed and maintained web applications. Worked on frontend and backend integration, database management, and API development.",
    },
  ];

  const education = [
    {
      degree: "Bachelor of Science",
      institution: "Maharshi Dayanand University",
      year: "2021",
      location: "Rohtak",
    },
    {
      degree: "12th Grade",
      institution: "SM Memorial Sr Sec School",
      year: "2018",
      location: "Rohtak",
    },
  ];

  const highlights = [
    {
      icon: Code2,
      title: "Full-Stack Development",
      description: "Expert in MERN stack with 1+ year of professional experience building scalable applications"
    },
    {
      icon: Zap,
      title: "Fast & Efficient",
      description: "Optimized solutions with focus on performance, clean code, and maintainability"
    },
    {
      icon: Target,
      title: "Problem Solver",
      description: "Passionate about solving complex technical challenges and delivering quality solutions"
    },
    {
      icon: Heart,
      title: "Client Focused",
      description: "Dedicated to understanding client needs and delivering exceptional user experiences"
    },
    {
      icon: Award,
      title: "Continuous Learner",
      description: "Always exploring new technologies and best practices in web development"
    },
    {
      icon: Lightbulb,
      title: "Creative Approach",
      description: "Combining creativity with technical expertise to build innovative solutions"
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
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
      <div className="container mx-auto px-4 py-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">About Me</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Transforming ideas into elegant, scalable web solutions
          </p>
        </motion.div>

        {/* Introduction */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 rounded-2xl blur-xl -z-10" />
              
              <div className="p-8 md:p-12 rounded-2xl border border-border/50 bg-card/50 backdrop-blur">
                <div className="flex items-center gap-3 mb-4">
                  <MapPin className="h-5 w-5 text-primary" />
                  <span className="text-muted-foreground font-medium">Rohtak, Haryana, India</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">MERN Stack Web Developer</h2>
                <p className="text-lg text-muted-foreground leading-relaxed mb-4">
                  I'm a passionate full-stack developer with 1+ year of hands-on experience building modern, scalable web applications. 
                  I specialize in the MERN stack (MongoDB, Express, React, Node.js) and have a strong foundation in creating 
                  secure, efficient, and user-friendly applications that solve real-world problems.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  My expertise spans REST API development, secure authentication systems, database architecture, and cloud deployment. 
                  I'm committed to writing clean, maintainable code and continuously learning new technologies to deliver cutting-edge solutions. 
                  Beyond code, I enjoy collaborating with teams, understanding client needs, and bringing creative ideas to life.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Highlights */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mb-20"
        >
          <h2 className="text-3xl font-bold mb-12 text-center">Why Work With Me</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {highlights.map((highlight, index) => {
              const Icon = highlight.icon;
              return (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ y: -5 }}
                  className="p-6 rounded-xl border border-border/50 bg-card/50 backdrop-blur hover:border-primary/30 transition-all"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-primary/10">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold mb-2 text-lg">{highlight.title}</h3>
                      <p className="text-sm text-muted-foreground">{highlight.description}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Experience Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <div className="flex items-center gap-2 mb-8">
            <Briefcase className="h-8 w-8 text-primary" />
            <h2 className="text-3xl font-bold">Experience</h2>
          </div>
          <div className="space-y-8">
            {experiences.map((exp, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative pl-8 border-l-2 border-primary/30 hover:border-primary transition-colors"
              >
                <motion.div className="absolute left-[-13px] top-0 w-6 h-6 rounded-full bg-primary border-4 border-background" />
                <div className="p-6 rounded-xl border border-border/50 bg-card/50 backdrop-blur hover:border-primary/30 transition-all hover:shadow-lg">
                  <h3 className="text-xl font-bold mb-2">{exp.title}</h3>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-muted-foreground mb-3">
                    <span className="font-semibold text-primary">{exp.company}</span>
                    <span className="hidden sm:inline text-border">•</span>
                    <span>{exp.period}</span>
                    <span className="hidden sm:inline text-border">•</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {exp.location}
                    </span>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">{exp.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Education */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <div className="flex items-center gap-2 mb-8">
            <GraduationCap className="h-8 w-8 text-primary" />
            <h2 className="text-3xl font-bold">Education</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {education.map((edu, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="p-6 rounded-xl border border-border/50 bg-card/50 backdrop-blur hover:border-primary/30 transition-all hover:shadow-lg"
              >
                <h3 className="text-xl font-bold mb-2">{edu.degree}</h3>
                <p className="text-primary font-semibold mb-3">{edu.institution}</p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="px-3 py-1 rounded-full bg-primary/10 font-medium">{edu.year}</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {edu.location}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Skills Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h2 className="text-3xl font-bold mb-8">Core Competencies</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl border border-border/50 bg-card/50 backdrop-blur">
              <h3 className="font-bold text-primary mb-4 text-lg">Frontend</h3>
              <div className="space-y-2">
                {['React', 'TypeScript', 'Tailwind CSS', 'ShadCN UI', 'Redux', 'React Router'].map((skill) => (
                  <motion.p
                    key={skill}
                    whileHover={{ x: 5 }}
                    className="text-sm text-muted-foreground flex items-center gap-2"
                  >
                    <span className="h-2 w-2 rounded-full bg-primary" />
                    {skill}
                  </motion.p>
                ))}
              </div>
            </div>
            <div className="p-6 rounded-xl border border-border/50 bg-card/50 backdrop-blur">
              <h3 className="font-bold text-primary mb-4 text-lg">Backend</h3>
              <div className="space-y-2">
                {['Node.js', 'Express', 'MongoDB', 'Mongoose', 'JWT Auth', 'REST APIs'].map((skill) => (
                  <motion.p
                    key={skill}
                    whileHover={{ x: 5 }}
                    className="text-sm text-muted-foreground flex items-center gap-2"
                  >
                    <span className="h-2 w-2 rounded-full bg-primary" />
                    {skill}
                  </motion.p>
                ))}
              </div>
            </div>
            <div className="p-6 rounded-xl border border-border/50 bg-card/50 backdrop-blur">
              <h3 className="font-bold text-primary mb-4 text-lg">DevOps & Tools</h3>
              <div className="space-y-2">
                {['Linux', 'Nginx', 'PM2', 'Git/GitHub', 'Netlify', 'Vercel'].map((skill) => (
                  <motion.p
                    key={skill}
                    whileHover={{ x: 5 }}
                    className="text-sm text-muted-foreground flex items-center gap-2"
                  >
                    <span className="h-2 w-2 rounded-full bg-primary" />
                    {skill}
                  </motion.p>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center p-8 rounded-2xl bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 border border-border/50"
        >
          <h3 className="text-2xl font-bold mb-3">Let's Build Something Great Together</h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Whether you're looking for a full-stack developer or need help with specific aspects of your project, 
            I'm here to help bring your ideas to life.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/contact">
              <Button size="lg">Start a Project</Button>
            </Link>
            <Link to="/resume">
              <Button size="lg" variant="outline">View My Resume</Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </PageLayout>
  );
};

export default About;
