import React from 'react';
import { Control, FieldValues, FieldErrors } from 'react-hook-form';
import { FieldRenderer } from './FieldRenderer';
import { ArrayField } from './ArrayField';
import type { SectionDef } from '@/lib/templates';

interface SectionRendererProps {
  section: SectionDef;
  control: Control<FieldValues>;
  errors: FieldErrors;
}

export const SectionRenderer: React.FC<SectionRendererProps> = ({ section, control, errors }) => {
  if (section.type === 'array') {
    return <ArrayField section={section} control={control} errors={errors} />;
  }

  const sectionErrors = errors[section.id] as Record<string, { message?: string }> | undefined;

  return (
    <div className="grid grid-cols-12 gap-4">
      {section.fields.map(field => {
        const fieldName = `${section.id}.${field.name}`;
        const fieldError = sectionErrors?.[field.name]?.message;
        return (
          <FieldRenderer
            key={field.name}
            field={field}
            control={control}
            name={fieldName}
            error={fieldError}
          />
        );
      })}
    </div>
  );
};
