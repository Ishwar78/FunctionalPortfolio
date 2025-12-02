import { motion } from "framer-motion";
import PageLayout from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Download, Mail, MapPin, Phone, Briefcase, GraduationCap, Code, ArrowRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useState, useRef } from "react";
import { api } from "@/lib/api";
import html2pdf from "html2pdf.js";

interface ExperienceItem {
  position: string;
  company: string;
  startDate: string;
  endDate: string;
  location: string;
  description: string[];
}

interface EducationItem {
  degree: string;
  institution: string;
  year: string;
  location: string;
  details?: string;
}

interface SkillCategory {
  name: string;
  skills: string[];
}

interface Resume {
  _id: string;
  fullName: string;
  title: string;
  email: string;
  phone?: string;
  location: string;
  profileImage?: string;
  summary: string;
  experience: ExperienceItem[];
  education: EducationItem[];
  skills: SkillCategory[];
  isActive: boolean;
}

const Resume = () => {
  const [expandedExperience, setExpandedExperience] = useState<string | null>(null);
  const resumeRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const downloadPDF = async () => {
    if (!resumeRef.current) return;

    setIsDownloading(true);
    try {
      const element = resumeRef.current;
      const opt = {
        margin: 10,
        filename: `${displayResume.fullName.replace(/\s+/g, '_')}_Resume.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' },
      };

      html2pdf().set(opt).from(element).save();
    } catch (error) {
      console.error('Error downloading PDF:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  const { data: resume, isLoading } = useQuery({
    queryKey: ['activeResume'],
    queryFn: async () => {
      try {
        const response = await api.get<Resume>('/api/resumes/active');
        return response;
      } catch {
        return null;
      }
    },
  });

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

  const defaultResume: Resume = {
    _id: 'default',
    fullName: 'Sachin Takoria',
    title: 'MERN Stack Web Developer',
    email: 'sachintakoria2204@gmail.com',
    phone: '+91-7015242844',
    location: 'Rohtak, Haryana, India',
    profileImage: '',
    summary: 'Passionate MERN Stack Developer with 1 year of experience building scalable web applications. Proficient in MongoDB, Express, React, and Node.js with expertise in REST APIs, authentication systems, database design, and deployment. Committed to writing clean, maintainable code and delivering exceptional user experiences.',
    experience: [
      {
        position: 'MERN Stack Web Developer',
        company: 'Satya Web Technology',
        startDate: 'Aug 2024',
        endDate: 'Present',
        location: 'Rohtak, Haryana',
        description: [
          'Developed full-stack web applications using MERN stack',
          'Implemented secure authentication systems with JWT and bcrypt',
          'Built and integrated REST APIs for various client projects',
          'Deployed applications on Linux servers using Nginx and PM2',
        ],
      },
      {
        position: 'Full Stack Developer Intern',
        company: 'CODE PLUS IT Services',
        startDate: 'Mar 2024',
        endDate: 'Oct 2024',
        location: 'Rohtak, Haryana',
        description: [
          'Contributed to frontend and backend development of web applications',
          'Worked with MongoDB for database management and schema design',
          'Collaborated with team members using Git and GitHub',
          'Implemented responsive designs using Tailwind CSS and React',
        ],
      },
    ],
    education: [
      {
        degree: 'Bachelor of Science',
        institution: 'Maharshi Dayanand University',
        year: '2021',
        location: 'Rohtak, Haryana',
      },
      {
        degree: '12th Grade',
        institution: 'SM Memorial Sr Sec School',
        year: '2018',
        location: 'Rohtak, Haryana',
      },
    ],
    skills: [
      {
        name: 'Frontend',
        skills: ['React', 'TypeScript', 'Tailwind CSS', 'ShadCN UI', 'Redux', 'React Router', 'REST API Integration'],
      },
      {
        name: 'Backend',
        skills: ['Node.js', 'Express', 'MongoDB', 'Mongoose', 'JWT Authentication', 'REST APIs', 'MVC'],
      },
      {
        name: 'DevOps',
        skills: ['Linux', 'Nginx', 'PM2', 'SSL Setup', 'Git', 'GitHub', 'Netlify', 'Vercel'],
      },
    ],
    isActive: true,
  };

  const displayResume = resume || defaultResume;

  if (isLoading) {
    return (
      <PageLayout>
        <div className="container mx-auto px-4 py-20 text-center">
          <p className="text-muted-foreground">Loading resume...</p>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-20 max-w-5xl" ref={resumeRef}>
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <div className="relative">
            {/* Decorative background */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 rounded-2xl blur-xl -z-10" />
            
            <div className="flex flex-col md:flex-row gap-8 p-8 rounded-2xl border border-border/50 bg-card/50 backdrop-blur">
              {displayResume.profileImage && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 }}
                  className="flex-shrink-0"
                >
                  <img
                    src={displayResume.profileImage}
                    alt={displayResume.fullName}
                    className="w-32 h-32 rounded-full object-cover border-4 border-primary/20"
                  />
                </motion.div>
              )}

              <div className="flex-1">
                <h1 className="text-4xl md:text-5xl font-bold mb-2">{displayResume.fullName}</h1>
                <p className="text-xl text-primary font-semibold mb-4">{displayResume.title}</p>

                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-6">
                  <a href={`mailto:${displayResume.email}`} className="flex items-center gap-2 hover:text-primary transition-colors">
                    <Mail className="h-4 w-4" />
                    {displayResume.email}
                  </a>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    {displayResume.location}
                  </div>
                  {displayResume.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      {displayResume.phone}
                    </div>
                  )}
                </div>

                <Button
                  size="lg"
                  className="gap-2"
                  onClick={downloadPDF}
                  disabled={isDownloading}
                >
                  <Download className="h-4 w-4" />
                  {isDownloading ? 'Generating PDF...' : 'Download PDF'}
                </Button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
            <div className="h-1 w-8 bg-gradient-to-r from-primary to-accent rounded-full" />
            Professional Summary
          </h2>
          <div className="p-6 rounded-xl border border-border/50 bg-card/50 backdrop-blur">
            <p className="text-lg leading-relaxed text-muted-foreground">
              {displayResume.summary}
            </p>
          </div>
        </motion.div>

        {/* Experience */}
        {displayResume.experience && displayResume.experience.length > 0 && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mb-12"
          >
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
              <Briefcase className="h-8 w-8 text-primary" />
              Experience
            </h2>

            <div className="space-y-4">
              {displayResume.experience.map((exp, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  onClick={() => setExpandedExperience(expandedExperience === index.toString() ? null : index.toString())}
                  className="cursor-pointer"
                >
                  <div className="p-6 rounded-xl border border-border/50 bg-card/50 backdrop-blur hover:border-primary/30 transition-all hover:shadow-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold hover:text-primary transition-colors">{exp.position}</h3>
                        <p className="text-primary font-semibold">{exp.company}</p>
                      </div>
                      <motion.div animate={{ rotate: expandedExperience === index.toString() ? 180 : 0 }}>
                        <ArrowRight className="h-5 w-5 text-muted-foreground" />
                      </motion.div>
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-3">
                      <span>{exp.startDate} – {exp.endDate}</span>
                      <span className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        {exp.location}
                      </span>
                    </div>

                    <motion.div
                      initial={false}
                      animate={{
                        height: expandedExperience === index.toString() ? "auto" : 0,
                        opacity: expandedExperience === index.toString() ? 1 : 0,
                      }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      {expandedExperience === index.toString() && (
                        <ul className="list-disc list-inside space-y-2 text-muted-foreground pt-4 border-t border-border/30">
                          {exp.description.map((desc, i) => (
                            <li key={i} className="text-sm leading-relaxed">{desc}</li>
                          ))}
                        </ul>
                      )}
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Education */}
        {displayResume.education && displayResume.education.length > 0 && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mb-12"
          >
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
              <GraduationCap className="h-8 w-8 text-primary" />
              Education
            </h2>

            <div className="space-y-4">
              {displayResume.education.map((edu, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="p-6 rounded-xl border border-border/50 bg-card/50 backdrop-blur hover:border-primary/30 transition-all"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-xl font-bold">{edu.degree}</h3>
                      <p className="text-primary font-semibold">{edu.institution}</p>
                    </div>
                    <span className="text-sm font-medium text-muted-foreground bg-primary/5 px-3 py-1 rounded-full">
                      {edu.year}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    {edu.location}
                  </div>
                  {edu.details && (
                    <p className="text-sm text-muted-foreground mt-3">{edu.details}</p>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Skills */}
        {displayResume.skills && displayResume.skills.length > 0 && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mb-12"
          >
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
              <Code className="h-8 w-8 text-primary" />
              Technical Skills
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {displayResume.skills.map((category, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="p-6 rounded-xl border border-border/50 bg-card/50 backdrop-blur hover:border-primary/30 transition-all"
                >
                  <h3 className="font-bold text-primary mb-4 text-lg">{category.name}</h3>
                  <ul className="space-y-2">
                    {category.skills.map((skill, i) => (
                      <motion.li
                        key={i}
                        whileHover={{ x: 5 }}
                        className="text-sm text-muted-foreground flex items-center gap-2"
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                        {skill}
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mt-16 text-center p-8 rounded-xl bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 border border-border/50"
        >
          <h3 className="text-2xl font-bold mb-3">Ready to Collaborate?</h3>
          <p className="text-muted-foreground mb-6">Let's discuss how I can contribute to your project</p>
          <Button size="lg" variant="default" className="gap-2">
            <Mail className="h-4 w-4" />
            Get in Touch
          </Button>
        </motion.div>
      </div>
    </PageLayout>
  );
};

export default Resume;
