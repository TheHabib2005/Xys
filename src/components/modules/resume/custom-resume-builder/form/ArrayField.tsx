import React from 'react';
import { useFieldArray, Control, FieldValues, FieldErrors } from 'react-hook-form';
import { Plus, Trash2, Copy, GripVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FieldRenderer } from './FieldRenderer';
import type { SectionDef } from '@/lib/templates';
import { buildEmptyItem } from '@/lib/buildDefaultValues';

interface ArrayFieldProps {
  section: SectionDef;
  control: Control<FieldValues>;
  errors: FieldErrors;
}

export const ArrayField: React.FC<ArrayFieldProps> = ({ section, control, errors }) => {
  const { fields, append, remove, swap } = useFieldArray({
    control,
    name: section.id,
  });

  const sectionErrors = errors[section.id] as unknown as Record<string, Record<string, { message?: string }>>[] | undefined;

  return (
    <div className="space-y-4">
      {fields.map((item, index) => (
        <div
          key={item.id}
          className="relative group rounded-lg border border-border bg-card p-5 transition-all hover:shadow-sm"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <GripVertical className="w-4 h-4 text-muted-foreground/40" />
              <span className="text-sm font-semibold text-foreground">
                {section.itemLabel || 'Item'} {index + 1}
              </span>
            </div>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-muted-foreground hover:text-foreground"
                onClick={() => append({ ...buildEmptyItem(section.fields) })}
                title="Duplicate"
              >
                <Copy className="w-3.5 h-3.5" />
              </Button>
              {fields.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-muted-foreground hover:text-destructive"
                  onClick={() => remove(index)}
                  title="Remove"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              )}
            </div>
          </div>

          {/* Fields Grid */}
          <div className="grid grid-cols-12 gap-4">
            {section.fields.map(fieldDef => {
              const fieldName = `${section.id}.${index}.${fieldDef.name}`;
              const fieldError = sectionErrors?.[index]?.[fieldDef.name]?.message as string | undefined;
              return (
                <FieldRenderer
                  key={fieldDef.name}
                  field={fieldDef}
                  control={control}
                  name={fieldName}
                  error={fieldError}
                />
              );
            })}
          </div>
        </div>
      ))}

      {/* Add Button */}
      {(!section.maxItems || fields.length < section.maxItems) && (
        <Button
          type="button"
          variant="outline"
          className="w-full border-dashed border-border text-muted-foreground hover:text-foreground hover:border-foreground/30 h-11"
          onClick={() => append(buildEmptyItem(section.fields))}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add {section.itemLabel || 'Item'}
        </Button>
      )}
    </div>
  );
};
