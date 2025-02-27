'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ImageIcon, Loader2, X } from 'lucide-react';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';

const MAX_FILE_SIZE = 5 * 1024 * 1024; 

export function ImageUpload({ value, onChange, disabled, onUploadingChange }) {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const abortController = useRef(null);

  const handleCancel = () => {
    if (abortController.current) {
      abortController.current.abort();
      abortController.current = null;
      setIsUploading(false);
      onUploadingChange?.(false);
    }
  };

  async function onFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    
    if (file.size > MAX_FILE_SIZE) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Image size must be less than 5MB',
      });
      return;
    }

    try {
      setIsUploading(true);
      onUploadingChange?.(true);

      const formData = new FormData();
      formData.append('file', file);
      formData.append(
        'upload_preset',
        process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
      );

      
      abortController.current = new AbortController();

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData,
          signal: abortController.current.signal,
        }
      );

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error.message);
      }

      onChange(data.secure_url);
      toast({
        title: 'Success',
        description: 'Image uploaded successfully',
      });
    } catch (error) {
      if (error.name === 'AbortError') {
        toast({
          description: 'Upload cancelled',
        });
      } else {
        console.error('Upload failed:', error);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to upload image',
        });
      }
    } finally {
      setIsUploading(false);
      onUploadingChange?.(false);
      abortController.current = null;
    }
  }

  return (
    <div className="flex items-center gap-4">
      <div className="relative w-40 h-40 border rounded-lg overflow-hidden">
        {value ? (
          <>
            <Image
              src={value}
              alt="Template image"
              fill
              className="object-cover"
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 bg-background/80 hover:bg-background/90"
              onClick={() => onChange('')}
              disabled={disabled || isUploading}
            >
              <X className="h-4 w-4" />
            </Button>
          </>
        ) : (
          <div className="h-full flex items-center justify-center bg-muted">
            <ImageIcon className="h-8 w-8 text-muted-foreground" />
          </div>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <input
          type="file"
          accept="image/*"
          className="hidden"
          id="image-upload"
          onChange={onFileChange}
          disabled={disabled || isUploading}
        />
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            disabled={disabled || isUploading}
            onClick={() => document.getElementById('image-upload').click()}
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              'Upload Image'
            )}
          </Button>
          {isUploading && (
            <Button type="button" variant="destructive" onClick={handleCancel}>
              Cancel
            </Button>
          )}
        </div>
        <p className="text-xs text-muted-foreground">Maximum file size: 5MB</p>
      </div>
    </div>
  );
}
