'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import {
  FileEdit, // for fill out
  Link2, // for share
  Check, // for copied state
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export function TemplateUserActions({ template }) {
  const router = useRouter();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const [formUrl, setFormUrl] = useState('');

  // Set form URL after component mounts on client
  useEffect(() => {
    setFormUrl(`${window.location.origin}/forms/${template.id}`);
  }, [template.id]);

  //   const formUrl = `${window.location.origin}/forms/${template.id}`;

  const copyLink = async () => {
    if (!formUrl) return;
    try {
      await navigator.clipboard.writeText(formUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        title: 'Link copied',
        description: 'Form link copied to clipboard',
      });
    } catch (err) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to copy link',
      });
    }
  };

  return (
    <div className="flex items-center gap-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push(`/forms/${template.id}`)}
            >
              <FileEdit className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Fill out form</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" onClick={copyLink}>
              {copied ? (
                <Check className="h-4 w-4 text-green-600" />
              ) : (
                <Link2 className="h-4 w-4" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Share form</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
