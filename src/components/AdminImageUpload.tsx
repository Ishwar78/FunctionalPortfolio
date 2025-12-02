import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { X, Upload, ImagePlus } from "lucide-react";

interface ImageInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  preview?: boolean;
}

interface ImageGalleryProps {
  title: string;
  description?: string;
  images: Array<{ id: string; url: string; alt: string }>;
  onRemove: (id: string) => void;
}

export const ImageInput = ({
  label,
  value,
  onChange,
  placeholder = "https://example.com/image.jpg",
  preview = true,
}: ImageInputProps) => {
  const [previewVisible, setPreviewVisible] = useState(false);

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium">{label}</label>
      <div className="flex gap-2">
        <Input
          type="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1"
        />
        {preview && value && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setPreviewVisible(!previewVisible)}
          >
            {previewVisible ? "Hide" : "Preview"}
          </Button>
        )}
      </div>
      {previewVisible && value && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="relative h-48 overflow-hidden rounded-lg border border-border bg-muted"
        >
          <img
            src={value}
            alt="Preview"
            className="w-full h-full object-cover"
            onError={(e: any) => {
              e.target.src =
                "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=300&fit=crop";
            }}
          />
        </motion.div>
      )}
    </div>
  );
};

export const ImageGallery = ({ title, description, images, onRemove }: ImageGalleryProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ImagePlus className="h-5 w-5" />
          {title}
        </CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        {images.length === 0 ? (
          <div className="text-center py-8">
            <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">No images added yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((img, index) => (
              <motion.div
                key={img.id || index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="relative group"
              >
                <div className="relative h-32 overflow-hidden rounded-lg border border-border bg-muted">
                  <img
                    src={img.url}
                    alt={img.alt}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    onError={(e: any) => {
                      e.target.src =
                        "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=200&h=200&fit=crop";
                    }}
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onRemove(img.id || index.toString())}
                  className="absolute top-1 right-1 bg-red-500/80 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-4 w-4" />
                </motion.button>
                {img.alt && (
                  <p className="text-xs text-muted-foreground mt-2 truncate">{img.alt}</p>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ImageInput;
