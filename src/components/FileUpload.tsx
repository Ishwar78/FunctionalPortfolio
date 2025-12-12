import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Upload, X, ImagePlus, Loader2 } from 'lucide-react';
import { api } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

interface FileUploadProps {
  label: string;
  value?: string;
  onChange: (fileId: string, url: string) => void;
  onDelete?: (fileId?: string) => void;
  accept?: string;
  preview?: boolean;
  helpText?: string;
}

export const FileUpload = ({
  label,
  value,
  onChange,
  onDelete,
  accept = 'image/*',
  preview = true,
  helpText,
}: FileUploadProps) => {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/files/upload', {
        method: 'POST',
        body: formData,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      onChange(data.fileId, data.url);

      toast({
        title: 'Success',
        description: 'File uploaded successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to upload file',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleDelete = () => {
    onDelete?.();
    setPreviewVisible(false);
  };

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium">{label}</label>
      
      <div className="flex gap-2">
        <label className="flex-1">
          <input
            type="file"
            accept={accept}
            onChange={handleFileChange}
            disabled={uploading}
            className="hidden"
          />
          <Button
            type="button"
            variant="outline"
            className="w-full"
            disabled={uploading}
            asChild
          >
            <div className="cursor-pointer flex items-center gap-2">
              {uploading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4" />
                  {value ? 'Change File' : 'Upload File'}
                </>
              )}
            </div>
          </Button>
        </label>

        {preview && value && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setPreviewVisible(!previewVisible)}
          >
            {previewVisible ? 'Hide' : 'Preview'}
          </Button>
        )}

        {value && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleDelete}
            className="text-red-500 hover:text-red-600"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {helpText && <p className="text-xs text-muted-foreground">{helpText}</p>}

      {previewVisible && value && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="relative h-48 overflow-hidden rounded-lg border border-border bg-muted"
        >
          <img
            src={value}
            alt="Preview"
            className="w-full h-full object-cover"
            onError={(e: any) => {
              e.target.src =
                'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=300&fit=crop';
            }}
          />
        </motion.div>
      )}
    </div>
  );
};

export default FileUpload;
