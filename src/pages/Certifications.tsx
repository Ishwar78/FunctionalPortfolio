import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
import PageLayout from '@/components/layout/PageLayout';
import { motion } from 'framer-motion';
import { Calendar, ExternalLink, Award } from 'lucide-react';

interface Certification {
  _id: string;
  title: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  credentialId?: string;
  credentialUrl?: string;
  certificateImage?: string;
  description?: string;
  skills?: string[];
}

const CertificationsPage = () => {
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCertifications();
  }, []);

  const loadCertifications = async () => {
    try {
      const data = await api.get<Certification[]>('/api/certifications');
      setCertifications(data);
    } catch (error) {
      console.error('Failed to load certifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: string) => {
    try {
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
      });
    } catch {
      return date;
    }
  };

  const isExpired = (expiryDate?: string) => {
    if (!expiryDate) return false;
    return new Date(expiryDate) < new Date();
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
    <PageLayout title="Certifications" description="My professional certifications and training">
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 py-12 px-4">
        <motion.div
          className="max-w-4xl mx-auto space-y-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Certifications & Training</h1>
            <p className="text-lg text-muted-foreground">
              Professional certificates and training courses I have completed
            </p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-muted-foreground">Loading certifications...</p>
            </div>
          ) : certifications.length === 0 ? (
            <Card>
              <CardContent className="py-12">
                <p className="text-center text-muted-foreground">No certifications found</p>
              </CardContent>
            </Card>
          ) : (
            <motion.div className="grid gap-6" variants={containerVariants}>
              {certifications.map((cert) => (
                <motion.div key={cert._id} variants={itemVariants}>
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start gap-4">
                        {cert.certificateImage && (
                          <img
                            src={cert.certificateImage}
                            alt={cert.title}
                            className="w-32 h-32 object-cover rounded-lg flex-shrink-0"
                          />
                        )}
                        <div className="flex-1">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <CardTitle className="flex items-center gap-2 text-xl">
                                <Award className="w-5 h-5 text-primary" />
                                {cert.title}
                              </CardTitle>
                              <CardDescription className="text-base mt-1">
                                {cert.issuer}
                              </CardDescription>
                            </div>
                            {isExpired(cert.expiryDate) && (
                              <span className="bg-red-100 text-red-800 text-xs font-semibold px-3 py-1 rounded-full">
                                Expired
                              </span>
                            )}
                          </div>

                          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mt-4">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              <span>{formatDate(cert.issueDate)}</span>
                            </div>
                            {cert.expiryDate && (
                              <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                <span>Expires: {formatDate(cert.expiryDate)}</span>
                              </div>
                            )}
                            {cert.credentialId && (
                              <div className="text-xs">ID: {cert.credentialId}</div>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {cert.description && (
                        <p className="text-sm text-foreground">{cert.description}</p>
                      )}

                      {cert.skills && cert.skills.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-sm mb-3">Key Skills</h4>
                          <div className="flex flex-wrap gap-2">
                            {cert.skills.map((skill) => (
                              <span
                                key={skill}
                                className="bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-slate-100 text-xs font-medium px-3 py-1 rounded-full"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {cert.credentialUrl && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(cert.credentialUrl, '_blank')}
                          className="gap-2"
                        >
                          View Credential
                          <ExternalLink className="w-4 h-4" />
                        </Button>
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

export default CertificationsPage;
