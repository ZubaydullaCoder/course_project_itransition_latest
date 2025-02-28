'use client';

import Image from 'next/image';
import {
  Pencil,
  Eye,
  BarChart,
  Trash2,
  ClipboardEdit,
  Globe,
  Lock,
  Check,
  Link2,
  MoreVertical,
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
import { useState, useEffect } from 'react';
import { deleteTemplate } from '@/lib/actions/template-actions';
import { formatDate } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function TemplateCard({ template, isOwner, isAdmin }) {
  const router = useRouter();
  const { toast } = useToast();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [copied, setCopied] = useState(false);

  const hasSubmitted = template.responses && template.responses.length > 0;

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
    const formUrl = `${window.location.origin}/templates/${template.id}?tab=myResponse`;
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
      className="h-[380px] hover:shadow-md transition-shadow cursor-pointer group"
      onClick={(e) => {
        if (e.target.closest('button')) {
          e.stopPropagation();
          return;
        }
        router.push(`/templates/${template.id}`);
      }}
    >
      <div className="relative w-full h-[170px]">
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
          <Image
            src="/images/2155223.jpg"
            alt={template.title}
            fill
            className="object-cover h-full rounded-t-lg"
            sizes="(min-width: 1024px) 20vw, (min-width: 768px) 30vw, 90vw"
            priority={false}
          />
        )}
      </div>
      <div className="h-[9.5rem]">
        <CardHeader className="px-3 py-2 space-y-2">
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
            <span className="text-xs line-clamp-1 text-muted-foreground">
              {formatDate(template.createdAt)}
            </span>
          </div>

          <div className="text-sm text-muted-foreground">
            {hasSubmitted ? (
              <div className="flex items-center gap-1">
                <Check className="h-4 w-4 text-green-600" />
                <span>You have submitted</span>
              </div>
            ) : (
              <div className="flex items-center gap-1">
                <ClipboardEdit className="h-4 w-4" />
                <span>You havent submitted</span>
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="px-3 py-1">
          <div className="flex justify-between items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              {template.topic}
            </Badge>
            <div className="text-sm text-muted-foreground">
              {template._count?.responses > 0
                ? `${template._count.responses} responses`
                : 'No responses yet'}
            </div>
          </div>
        </CardContent>
      </div>
      <CardFooter className="flex gap-2 items-center justify-between px-2 flex-grow-0 py-1 border-t">
        <div className="flex-1 overflow-x-auto overflow-y-hidden scrollbar-hide">
          <div className="flex gap-0.5 w-max">
            {template.tags?.length > 0 ? (
              template.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="text-[10px] px-1.5 py-0 h-5 truncate max-w-[80px] flex-shrink-0"
                >
                  {tag}
                </Badge>
              ))
            ) : (
              <span className="text-xs text-muted-foreground">
                No tags added
              </span>
            )}
          </div>
        </div>

        {isOwner || isAdmin ? (
          <TooltipProvider>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="flex-shrink-0 ml-2"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/templates/${template.id}?tab=myResponse`);
                  }}
                >
                  <ClipboardEdit className="h-4 w-4 mr-2" />
                  {hasSubmitted ? 'Update Response' : 'Fill Form'}
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    copyLink();
                  }}
                >
                  {copied ? (
                    <Check className="h-4 w-4 mr-2 text-green-600" />
                  ) : (
                    <Link2 className="h-4 w-4 mr-2" />
                  )}
                  {copied ? 'Copied!' : 'Copy Link'}
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/templates/${template.id}?tab=results`);
                  }}
                >
                  <BarChart className="h-4 w-4 mr-2" />
                  View Responses
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/templates/${template.id}`);
                  }}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Preview Form
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/templates/${template.id}/edit`);
                  }}
                >
                  <Pencil className="h-4 w-4 mr-2" />
                  Edit Template
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowDeleteDialog(true);
                  }}
                  className="text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Template
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </TooltipProvider>
        ) : (
          <div className="flex items-center">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/templates/${template.id}?tab=myResponse`);
                    }}
                  >
                    <ClipboardEdit className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{hasSubmitted ? 'Update Response' : 'Fill Form'}</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      copyLink();
                    }}
                  >
                    {copied ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <Link2 className="h-4 w-4" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{copied ? 'Copied!' : 'Copy Link'}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        )}
      </CardFooter>
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
