'use client';

import Link from 'next/link';
import Image from 'next/image';
import {
  ImageIcon,
  Pencil,
  Share2,
  Eye,
  BarChart,
  Trash2,
  ClipboardEdit,
  Globe,
  Lock,
} from 'lucide-react';
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { deleteTemplate } from '@/lib/actions/template-actions';
import { formatDate } from '@/lib/utils';

export function TemplateCard({ template, isOwner }) {
  const router = useRouter();
  const { toast } = useToast();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [copied, setCopied] = useState(false);

  async function onDelete() {
    setIsDeleting(true);
    try {
      const result = await deleteTemplate(template.id);
      if (result.error) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: result.error,
        });
        return;
      }
      toast({
        title: 'Success',
        description: 'Template deleted successfully',
      });
      router.refresh();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Something went wrong',
      });
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  }

  const copyLink = async () => {
    const formUrl = `${window.location.origin}/forms/${template.id}`;
    try {
      await navigator.clipboard.writeText(formUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        title: 'Success',
        description: 'Form link copied to clipboard',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to copy link',
      });
    }
  };

  return (
    <Card
      className="flex flex-col h-[380px] hover:shadow-md transition-shadow cursor-pointer group"
      onClick={(e) => {
        // Prevent navigation if clicking on action buttons
        if (e.target.closest('button')) {
          e.stopPropagation();
          return;
        }
        router.push(`/templates/${template.id}`);
      }}
    >
      {/* Image Section */}
      <div className="relative w-full h-[140px]">
        {template.image ? (
          <Image
            src={template.image}
            alt={template.title}
            fill
            className="object-cover rounded-t-lg"
            sizes="(min-width: 1024px) 20vw, (min-width: 768px) 30vw, 90vw"
            priority={false}
          />
        ) : (
          <div className="w-full h-full bg-muted rounded-t-lg flex items-center justify-center">
            <ImageIcon className="h-8 w-8 text-muted-foreground" />
          </div>
        )}
      </div>

      {/* Header Section - Remove Link since entire card is clickable */}
      <CardHeader className="p-4 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-lg line-clamp-1 flex-1 group-hover:underline">
            {template.title}
          </h3>
          {template.isPublic ? (
            <Globe className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          ) : (
            <Lock className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          )}
        </div>
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>by {template.author?.name}</span>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {template.description || 'No description'}
        </p>
      </CardHeader>

      {/* Content Section */}
      <CardContent className="flex-1 p-4">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <Badge variant="secondary" className="text-xs">
              {template.topic}
            </Badge>
            {template._count?.responses > 0 && (
              <div className="text-sm text-muted-foreground">
                {template._count.responses} responses
              </div>
            )}
          </div>
        </div>

        {/* Tags Section */}
        {template.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {template.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>

      {/* Footer Section - Updated action buttons */}
      <CardFooter className="flex justify-between items-center p-4 border-t">
        <span className="text-xs text-muted-foreground">
          Created {formatDate(template.createdAt)}
        </span>

        <TooltipProvider>
          <div className="flex items-center gap-1">
            {/* Common actions for all users */}
            <ActionButton
              icon={<ClipboardEdit className="h-4 w-4" />}
              tooltip="Fill Form"
              onClick={() => router.push(`/forms/${template.id}`)}
            />
            <ActionButton
              icon={<Share2 className="h-4 w-4" />}
              tooltip="Share Form"
              onClick={copyLink}
            />

            {/* Owner-specific actions */}
            {isOwner && (
              <>
                <ActionButton
                  icon={<BarChart className="h-4 w-4" />}
                  tooltip="View Responses"
                  onClick={() =>
                    router.push(`/templates/${template.id}/responses`)
                  }
                />
                <ActionButton
                  icon={<Eye className="h-4 w-4" />}
                  tooltip="Preview Form"
                  onClick={() => router.push(`/forms/${template.id}/preview`)}
                />
                <ActionButton
                  icon={<Pencil className="h-4 w-4" />}
                  tooltip="Edit Template"
                  onClick={() => router.push(`/templates/${template.id}/edit`)}
                />
                <ActionButton
                  icon={<Trash2 className="h-4 w-4 text-destructive" />}
                  tooltip="Delete Template"
                  onClick={() => setShowDeleteDialog(true)}
                />
              </>
            )}
          </div>
        </TooltipProvider>
      </CardFooter>

      {/* Delete Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              template.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={onDelete}
              className="bg-red-600 hover:bg-red-700"
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}

// Helper component for action buttons
function ActionButton({ icon, tooltip, onClick }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="ghost" size="icon" onClick={onClick}>
          {icon}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{tooltip}</p>
      </TooltipContent>
    </Tooltip>
  );
}
