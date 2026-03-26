import React from 'react';
import { Controller, Control, FieldValues, Path } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { FieldDef } from '@/lib/templates';
import { RichTextInput } from './RichTextInput';

interface FieldRendererProps {
  field: FieldDef;
  control: Control<FieldValues>;
  name: string;
  error?: string;
}

export const FieldRenderer: React.FC<FieldRendererProps> = ({ field, control, name, error }) => {
  if (field.ui?.hidden) return null;

  const gridClass = field.ui?.grid
    ? `col-span-12 md:col-span-${field.ui.grid}`
    : 'col-span-12';

  // Map grid values to actual tailwind classes to ensure they're generated
  const gridMap: Record<number, string> = {
    4: 'col-span-12 md:col-span-4',
    6: 'col-span-12 md:col-span-6',
    12: 'col-span-12',
  };
  const colClass = gridMap[field.ui?.grid || 12] || gridClass;

  return (
    <div className={colClass}>
      <Controller
        control={control}
        name={name as Path<FieldValues>}
        render={({ field: formField }) => {
          switch (field.type) {
            case 'checkbox':
              return (
                <div className="flex items-center gap-3 py-2">
                  <Checkbox
                    id={name}
                    checked={!!formField.value}
                    onCheckedChange={formField.onChange}
                  />
                  <Label htmlFor={name} className="text-sm font-normal text-foreground cursor-pointer">
                    {field.label}
                  </Label>
                </div>
              );

            case 'textarea':
              return (
                <div className="space-y-2">
                  <Label htmlFor={name} className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    {field.label}
                    {field.required && <span className="text-destructive ml-1">*</span>}
                  </Label>
                  <Textarea
                    id={name}
                    placeholder={field.placeholder}
                    value={formField.value || ''}
                    onChange={formField.onChange}
                    className={`min-h-[100px] resize-y bg-card border-border text-sm ${error ? 'border-destructive ring-1 ring-destructive/20' : ''}`}
                  />
                  {error && <p className="text-xs text-destructive mt-1">{error}</p>}
                </div>
              );

            case 'select':
              return (
                <div className="space-y-2">
                  <Label htmlFor={name} className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    {field.label}
                    {field.required && <span className="text-destructive ml-1">*</span>}
                  </Label>
                  <Select value={formField.value || ''} onValueChange={formField.onChange}>
                    <SelectTrigger className={`bg-card ${error ? 'border-destructive' : ''}`}>
                      <SelectValue placeholder={`Select ${field.label.toLowerCase()}`} />
                    </SelectTrigger>
                    <SelectContent>
                      {field.options?.map(opt => (
                        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {error && <p className="text-xs text-destructive mt-1">{error}</p>}
                </div>
              );

            case 'richtext':
              return (
                <div className="space-y-2">
                  <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    {field.label}
                    {field.required && <span className="text-destructive ml-1">*</span>}
                  </Label>
                  <RichTextInput
                    value={formField.value || ''}
                    onChange={formField.onChange}
                    placeholder={field.placeholder}
                    error={!!error}
                  />
                  {error && <p className="text-xs text-destructive mt-1">{error}</p>}
                </div>
              );

            default:
              return (
                <div className="space-y-2">
                  <Label htmlFor={name} className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    {field.label}
                    {field.required && <span className="text-destructive ml-1">*</span>}
                  </Label>
                  <Input
                    id={name}
                    type={field.type}
                    placeholder={field.placeholder}
                    value={formField.value || ''}
                    onChange={formField.onChange}
                    className={`bg-card border-border ${error ? 'border-destructive ring-1 ring-destructive/20' : ''}`}
                  />
                  {error && <p className="text-xs text-destructive mt-1">{error}</p>}
                </div>
              );
          }
        }}
      />
    </div>
  );
};
