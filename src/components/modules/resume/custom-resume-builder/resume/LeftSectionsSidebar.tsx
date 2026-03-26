import {
  DndContext, closestCenter, KeyboardSensor, PointerSensor,
  useSensor, useSensors, type DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove, SortableContext, sortableKeyboardCoordinates,
  useSortable, verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Section, SectionType } from '@/interfaces/custom-resume-builder';
import {
  GripVertical, Plus, Trash2, FileText, Briefcase, GraduationCap,
  Wrench, FolderOpen, Award, Globe, Heart, Users,
} from 'lucide-react';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Separator } from '@/components/ui/separator';

const sectionIcons: Record<string, React.ElementType> = {
  summary: FileText, experience: Briefcase, education: GraduationCap,
  skills: Wrench, projects: FolderOpen, certifications: Award,
  languages: Globe, hobbies: Heart, organization: Users,
};

const sectionLabels: Record<string, string> = {
  summary: 'Summary', experience: 'Experience', education: 'Education',
  skills: 'Skills', projects: 'Projects', certifications: 'Certifications',
  languages: 'Languages', hobbies: 'Hobbies', organization: 'Organizations',
};

interface LeftSidebarProps {
  sections: Section[];
  selectedSectionId: string | null;
  onSelect: (id: string | null) => void;
  onAdd: (type: SectionType) => void;
  onRemove: (id: string) => void;
  onReorder: (ids: string[]) => void;
}

function SortableItem({
  section, isActive, onSelect, onRemove,
}: {
  section: Section; isActive: boolean; onSelect: () => void; onRemove: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: section.id });
  const Icon = sectionIcons[section.type] || FileText;

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.4 : 1 }}
      className={`group flex items-center gap-2.5 px-3 py-2.5 cursor-pointer transition-all rounded-lg mx-2 mb-0.5 ${
        isActive
          ? 'bg-primary/10 text-primary shadow-sm'
          : 'text-muted-foreground hover:bg-accent hover:text-foreground'
      }`}
      onClick={onSelect}
      role="button"
      tabIndex={0}
      aria-label={`Select ${section.title} section`}
      onKeyDown={(e) => { if (e.key === 'Enter') onSelect(); }}
    >
      <button
        className="cursor-grab active:cursor-grabbing text-muted-foreground/50 hover:text-muted-foreground shrink-0 -ml-1"
        aria-label="Drag to reorder"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-3.5 w-3.5" />
      </button>
      <Icon className="h-4 w-4 shrink-0" />
      <span className="text-[13px] font-medium flex-1 truncate">{section.title}</span>

      <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button
              className="h-6 w-6 flex items-center justify-center rounded text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
              aria-label={`Remove ${section.title}`}
              onClick={(e) => e.stopPropagation()}
            >
              <Trash2 className="h-3 w-3" />
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Remove Section</AlertDialogTitle>
              <AlertDialogDescription>Remove "{section.title}" from your resume?</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={onRemove}>Remove</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}

export function LeftSectionsSidebar({ sections, selectedSectionId, onSelect, onAdd, onRemove, onReorder }: LeftSidebarProps) {
  const sorted = [...sections].sort((a, b) => a.position - b.position);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = sorted.findIndex((s) => s.id === active.id);
      const newIndex = sorted.findIndex((s) => s.id === over.id);
      onReorder(arrayMove(sorted, oldIndex, newIndex).map((s) => s.id));
    }
  };

  const existingTypes = new Set(sections.map((s) => s.type));
  const availableTypes = Object.keys(sectionLabels).filter((t) => !existingTypes.has(t as SectionType)) as SectionType[];

  return (
    <aside className="w-[280px] shrink-0 border-r border-border bg-card flex flex-col h-full" aria-label="Sections sidebar">
      <div className="px-4 pt-4 pb-2">
        <span className="text-xs font-semibold text-foreground">Sections</span>
      </div>

      <div className="flex-1 overflow-y-auto py-1">
        <div className="px-4 pb-1.5 pt-1">
          <span className="text-[10px] uppercase tracking-[0.1em] font-semibold text-muted-foreground">Active Sections</span>
        </div>

        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={sorted.map((s) => s.id)} strategy={verticalListSortingStrategy}>
            {sorted.map((section) => (
              <SortableItem
                key={section.id}
                section={section}
                isActive={selectedSectionId === section.id}
                onSelect={() => onSelect(section.id)}
                onRemove={() => onRemove(section.id)}
              />
            ))}
          </SortableContext>
        </DndContext>

        {availableTypes.length > 0 && (
          <>
            <Separator className="my-3 mx-4" />
            <div className="px-4 pb-1.5">
              <span className="text-[10px] uppercase tracking-[0.1em] font-semibold text-muted-foreground">Add Section</span>
            </div>
            {availableTypes.map((type) => {
              const Icon = sectionIcons[type] || FileText;
              return (
                <button
                  key={type}
                  onClick={() => onAdd(type)}
                  className="w-[calc(100%-16px)] mx-2 flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] text-muted-foreground hover:bg-accent hover:text-foreground transition-colors mb-0.5"
                >
                  <Icon className="h-4 w-4" />
                  <span className="flex-1 text-left">{sectionLabels[type]}</span>
                  <Plus className="h-3.5 w-3.5" />
                </button>
              );
            })}
          </>
        )}
      </div>
    </aside>
  );
}
