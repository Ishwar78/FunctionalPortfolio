import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { api } from '@/lib/api';
import PageLayout from '@/components/layout/PageLayout';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Code } from 'lucide-react';

interface Experience {
  _id: string;
  position: string;
  company: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  location: string;
  description: string[];
  technologies: string[];
  companyLogo?: string;
}

const ExperiencePage = () => {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadExperiences();
  }, []);

  const loadExperiences = async () => {
    try {
      const data = await api.get<Experience[]>('/api/experience');
      setExperiences(data);
    } catch (error) {
      console.error('Failed to load experiences:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: string) => {
    try {
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
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
    <PageLayout title="Experience" description="My professional work experience and roles">
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 py-12 px-4">
        <motion.div
          className="max-w-4xl mx-auto space-y-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Experience</h1>
            <p className="text-lg text-muted-foreground">
              A summary of my professional roles and responsibilities
            </p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-muted-foreground">Loading experiences...</p>
            </div>
          ) : experiences.length === 0 ? (
            <Card>
              <CardContent className="py-12">
                <p className="text-center text-muted-foreground">No experiences found</p>
              </CardContent>
            </Card>
          ) : (
            <motion.div className="space-y-6" variants={containerVariants}>
              {experiences.map((exp, index) => (
                <motion.div key={exp._id} variants={itemVariants}>
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            {exp.companyLogo && (
                              <img
                                src={exp.companyLogo}
                                alt={exp.company}
                                className="w-10 h-10 rounded-full object-cover"
                              />
                            )}
                            <div>
                              <CardTitle className="text-2xl">{exp.position}</CardTitle>
                              <CardDescription className="text-base">{exp.company}</CardDescription>
                            </div>
                          </div>
                        </div>
                        {exp.isCurrent && (
                          <span className="bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full">
                            Current
                          </span>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {formatDate(exp.startDate)} -{' '}
                            {exp.isCurrent ? 'Present' : formatDate(exp.endDate)}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span>{exp.location}</span>
                        </div>
                      </div>

                      {exp.description.length > 0 && (
                        <div>
                          <h4 className="font-semibold mb-3">Responsibilities & Achievements</h4>
                          <ul className="space-y-2">
                            {exp.description.map((desc, idx) => (
                              <li key={idx} className="flex gap-3">
                                <span className="text-primary mt-1">•</span>
                                <span className="text-sm text-foreground">{desc}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {exp.technologies.length > 0 && (
                        <div>
                          <div className="flex items-center gap-2 mb-3">
                            <Code className="w-4 h-4" />
                            <h4 className="font-semibold">Technologies</h4>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {exp.technologies.map((tech) => (
                              <span
                                key={tech}
                                className="bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-slate-100 text-xs font-medium px-3 py-1 rounded-full"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
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

export default ExperiencePage;
