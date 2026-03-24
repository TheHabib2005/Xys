import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ResumeTemplate } from '@/interfaces/resume';
import { deleteResume, updateResumeName } from '@/services/resume.services';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { formatDistanceToNow } from 'date-fns';
import { FileText, Loader2, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { toast } from 'sonner';
import { EditNameDialog } from './EdittResumeNameModal';

export interface ResumeItem {
  id: string;
  userId: string;
  name: string;
  isEdit: boolean;
  resumeUrl: string;
  templateId: string;
  resumeData: Record<string, any>;
  createdAt: string;
  resumeHtml: string;
}

const ResumeListItem = ({ resume, cacheKey }: { resume: ResumeItem, cacheKey: string }) => {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [editingResume, setEditingResume] = useState<ResumeItem | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const { mutateAsync: updateName, isPending: isUpdating } = useMutation({
    mutationFn: ({ resumeId, name, templateId }: { resumeId: string; name: string; templateId: string }) =>
      updateResumeName(resumeId, { name: name, templateId }),
  });

  const { mutateAsync: deleteResumeHandler, isPending: isDeleting } = useMutation({
    mutationFn: (id: string) => deleteResume(id)
  });

  const isLoading = isUpdating || isDeleting;

  const handleEditFull = (templateId: string, resumeId: string) => {
    if (isLoading) return;
    router.push(`/dashboard/templates/${templateId}/builder/${resumeId}?mode=edit`);
  };

  const handleDelete = async (id: string) => {
    const result = await deleteResumeHandler(id);
    if (result.success) {
      queryClient.invalidateQueries({ queryKey: [cacheKey] });
      toast.success(result.message);
    }
  };

  const handleOpenNameEdit = (resume: ResumeItem) => {
    setEditingResume(resume);
    setIsEditDialogOpen(true);
  };

  const handleSaveName = async (id: string, newName: string, templateId: string) => {
    const result = await updateName({ resumeId: id, name: newName, templateId });
    if (result.success) {
      queryClient.invalidateQueries({ queryKey: [cacheKey] });
      toast.success(result.message);
      setIsEditDialogOpen(false);
    }
  };

  return (
    <>
      <div
        key={resume.id}
        className="relative group overflow-hidden border-b border-border/40 last:border-0"
      >
        {/* ROW LOADING OVERLAY */}
        {isLoading && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/60 backdrop-blur-[1px] transition-all">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-background border shadow-sm">
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
              <span className="text-xs font-medium text-muted-foreground">
                {isDeleting ? "Deleting..." : "Updating..."}
              </span>
            </div>
          </div>
        )}

        <div
          className={`grid grid-cols-12 gap-4 px-6 py-5 items-center transition-all ${
            isLoading ? "blur-[2px] pointer-events-none" : "hover:bg-muted/20 cursor-pointer"
          }`}
          onClick={() => handleEditFull(resume.templateId, resume.id)}
        >
          {/* Name + Template */}
          <div className="col-span-5 flex items-center gap-3">
            <div className="h-10 w-10 bg-gradient-to-br from-primary/20 to-primary/5 rounded-xl flex items-center justify-center">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="font-medium text-card-foreground truncate">
                {resume.name || "Untitled Resume"}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                Template {resume.templateId.slice(0, 8)}
              </p>
            </div>
          </div>

          {/* Date */}
          <div className="col-span-4 text-sm text-muted-foreground">
            {formatDistanceToNow(new Date(resume.createdAt), { addSuffix: true })}
          </div>

          {/* Actions */}
          <div
            className="col-span-3 flex justify-end gap-1"
            onClick={(e) => e.stopPropagation()}
          >
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-lg"
              onClick={() => handleEditFull(resume.templateId, resume.id)}
              title="Edit full resume"
            >
              <Pencil className="h-4 w-4" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-lg"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="rounded-xl">
                <DropdownMenuItem onClick={() => handleOpenNameEdit(resume)}>
                  <Pencil className="h-4 w-4 mr-2" />
                  Edit name
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={() => handleDelete(resume.id)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <EditNameDialog
        resume={editingResume}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSave={handleSaveName}
        isUpdating={isUpdating}
      />
    </>
  );
}

export default ResumeListItem;