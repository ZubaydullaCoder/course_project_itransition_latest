// components/ui/image-upload.jsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ImageIcon, Loader2, X } from 'lucide-react';
import Image from 'next/image';

export function ImageUpload({ value, onChange, disabled, onUploadingChange }) {
  const [isUploading, setIsUploading] = useState(false);

  async function onFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      onUploadingChange?.(true);
      // Create FormData
      const formData = new FormData();
      formData.append('file', file);
      formData.append(
        'upload_preset',
        process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
      );

      // Upload to Cloudinary
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error.message);
      }

      onChange(data.secure_url);
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setIsUploading(false);
      onUploadingChange?.(false);
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
      </div>
    </div>
  );
}
