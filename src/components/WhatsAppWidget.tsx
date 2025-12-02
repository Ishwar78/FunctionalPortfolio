import { useState } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { toast } from "sonner";
import { z } from "zod";
import { api } from "@/lib/api";

const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Invalid email address").max(255),
  subject: z.string().trim().min(1, "Subject is required").max(200),
  message: z.string().trim().min(1, "Message is required").max(2000),
});

const WhatsAppWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

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

      toast.success("Enquiry sent successfully! I'll get back to you soon via WhatsApp.");
      setFormData({ name: "", email: "", subject: "", message: "" });
      setIsOpen(false);
    } catch (error: unknown) {
      if (error instanceof z.ZodError) {
        const first = error.errors?.[0]?.message ?? "Invalid input";
        toast.error(first);
      } else if (error instanceof Error) {
        toast.error(error.message || "Failed to send enquiry. Please try again.");
      } else {
        toast.error("Failed to send enquiry. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Floating WhatsApp Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-green-500 hover:bg-green-600 text-white shadow-lg flex items-center justify-center transition-colors"
        aria-label="Open WhatsApp enquiry form"
      >
        <MessageCircle size={24} />
      </motion.button>

      {/* Enquiry Form Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-green-500" />
              WhatsApp Enquiry
            </DialogTitle>
            <DialogDescription>
              Send your enquiry and I'll respond via WhatsApp shortly.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="dialog-name" className="block text-sm font-medium mb-1">
                Name *
              </label>
              <Input
                id="dialog-name"
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
              <label htmlFor="dialog-email" className="block text-sm font-medium mb-1">
                Email *
              </label>
              <Input
                id="dialog-email"
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
              <label htmlFor="dialog-subject" className="block text-sm font-medium mb-1">
                Subject *
              </label>
              <Input
                id="dialog-subject"
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
              <label htmlFor="dialog-message" className="block text-sm font-medium mb-1">
                Message *
              </label>
              <Textarea
                id="dialog-message"
                value={formData.message}
                onChange={(e) =>
                  setFormData((s) => ({ ...s, message: e.target.value }))
                }
                placeholder="Tell me about your enquiry..."
                rows={4}
                required
                maxLength={2000}
              />
              <p className="text-xs text-muted-foreground mt-1">
                {formData.message.length}/2000 characters
              </p>
            </div>

            <Button type="submit" className="w-full bg-green-500 hover:bg-green-600" disabled={isSubmitting}>
              {isSubmitting ? (
                "Sending..."
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Send via WhatsApp
                </>
              )}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default WhatsAppWidget;
