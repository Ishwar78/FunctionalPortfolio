import { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
import AdminLayout from '@/components/layout/AdminLayout';
import { useToast } from '@/hooks/use-toast';
import { Mail, Copy } from 'lucide-react';

interface Message {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
}

const AdminMessages = () => {
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    try {
      const data = await api.get<Message[]>('/api/admin/messages');
      setMessages(data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load messages',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copied',
      description: 'Text copied to clipboard',
    });
  };

  const openWhatsApp = (message: Message) => {
    const text = `Hi ${message.name}, Thank you for contacting me. I'll get back to you soon!`;
    const encoded = encodeURIComponent(text);
    const phone = message.email.includes('@') ? message.email.split('@')[0] : message.email;
    window.open(`https://wa.me/${phone}?text=${encoded}`, '_blank');
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Messages</h1>
          <p className="text-muted-foreground mt-2">View contact form submissions</p>
        </div>

        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : messages.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4">
                    No messages yet
                  </TableCell>
                </TableRow>
              ) : (
                messages.map((message) => (
                  <TableRow key={message._id}>
                    <TableCell className="font-medium">{message.name}</TableCell>
                    <TableCell>{message.email}</TableCell>
                    <TableCell>{message.subject}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(message.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setSelectedMessage(message)}
                            >
                              View
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>{message.subject}</DialogTitle>
                              <DialogDescription>From {message.name}</DialogDescription>
                            </DialogHeader>
                            {selectedMessage && (
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <p className="text-sm font-medium text-muted-foreground">Name</p>
                                    <p>{selectedMessage.name}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-muted-foreground">Email</p>
                                    <p>{selectedMessage.email}</p>
                                  </div>
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-muted-foreground">Message</p>
                                  <p className="mt-2 whitespace-pre-wrap">{selectedMessage.message}</p>
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  Received: {new Date(selectedMessage.createdAt).toLocaleString()}
                                </div>
                                <div className="flex gap-2 justify-end">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => copyToClipboard(selectedMessage.email)}
                                  >
                                    <Copy size={16} className="mr-1" /> Copy Email
                                  </Button>
                                  <Button
                                    size="sm"
                                    onClick={() => openWhatsApp(selectedMessage)}
                                  >
                                    <Mail size={16} className="mr-1" /> Reply on WhatsApp
                                  </Button>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminMessages;
