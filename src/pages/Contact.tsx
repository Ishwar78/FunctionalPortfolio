import { motion } from "framer-motion";
import PageLayout from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MapPin, Send, Phone } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { api } from "@/lib/api";

const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Invalid email address").max(255),
  subject: z.string().trim().min(1, "Subject is required").max(200),
  message: z.string().trim().min(1, "Message is required").max(2000),
});

interface ContactInfo {
  email?: string;
  phone?: string;
  address?: string;
  whatsapp_number?: string;
}

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [contactInfo, setContactInfo] = useState<ContactInfo>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadContactInfo = async () => {
      try {
        const info = await api.get<ContactInfo>("/api/content/contact").catch(() => ({}));
        setContactInfo(info);
      } catch (error) {
        console.error("Failed to load contact info:", error);
      }
    };
    loadContactInfo();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const validatedData = contactSchema.parse(formData);
      setIsSubmitting(true);

      await api.post("/api/contact", {
        name: validatedData.name,
        email: validatedData.email,
        subject: validatedData.subject,
        message: validatedData.message,
      });

      toast.success("Message sent successfully! I'll get back to you soon.");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error: unknown) {
      if (error instanceof z.ZodError) {
        const first = error.errors?.[0]?.message ?? "Invalid input";
        toast.error(first);
      } else if (error instanceof Error) {
        toast.error(error.message || "Failed to send message. Please try again.");
      } else {
        toast.error("Failed to send message. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
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
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Get In Touch</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Have a project in mind or want to collaborate? I'd love to hear from you!
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-8"
          >
            <div>
              <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
              <div className="space-y-4">
                {contactInfo.email && (
                  <div className="flex items-start gap-4 p-4 rounded-lg border border-border bg-card">
                    <Mail className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <h3 className="font-semibold mb-1">Email</h3>
                      <a
                        href={`mailto:${contactInfo.email}`}
                        className="text-muted-foreground hover:text-primary transition-colors"
                      >
                        {contactInfo.email}
                      </a>
                    </div>
                  </div>
                )}

                {contactInfo.phone && (
                  <div className="flex items-start gap-4 p-4 rounded-lg border border-border bg-card">
                    <Phone className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <h3 className="font-semibold mb-1">Phone</h3>
                      <a
                        href={`tel:${contactInfo.phone}`}
                        className="text-muted-foreground hover:text-primary transition-colors"
                      >
                        {contactInfo.phone}
                      </a>
                    </div>
                  </div>
                )}

                {contactInfo.address && (
                  <div className="flex items-start gap-4 p-4 rounded-lg border border-border bg-card">
                    <MapPin className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <h3 className="font-semibold mb-1">Location</h3>
                      <p className="text-muted-foreground">{contactInfo.address}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="p-6 rounded-lg border border-primary/20 bg-primary/5">
              <h3 className="font-semibold mb-2">Quick Response</h3>
              <p className="text-sm text-muted-foreground">
                I typically respond to messages within 24 hours. Feel free to reach out about
                projects, collaborations, or just to say hello!
              </p>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2">
                  Name *
                </label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((s) => ({ ...s, name: e.target.value }))
                  }
                  placeholder="Your name"
                  required
                  maxLength={100}
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Email *
                </label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData((s) => ({ ...s, email: e.target.value }))
                  }
                  placeholder="your.email@example.com"
                  required
                  maxLength={255}
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium mb-2">
                  Subject *
                </label>
                <Input
                  id="subject"
                  value={formData.subject}
                  onChange={(e) =>
                    setFormData((s) => ({ ...s, subject: e.target.value }))
                  }
                  placeholder="What's this about?"
                  required
                  maxLength={200}
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-2">
                  Message *
                </label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) =>
                    setFormData((s) => ({ ...s, message: e.target.value }))
                  }
                  placeholder="Tell me about your project or inquiry..."
                  rows={6}
                  required
                  maxLength={2000}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {formData.message.length}/2000 characters
                </p>
              </div>

              <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  "Sending..."
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Send Message
                  </>
                )}
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Contact;
