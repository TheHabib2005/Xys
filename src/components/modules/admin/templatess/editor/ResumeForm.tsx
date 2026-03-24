import React from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { Section, Field } from '@/interfaces/templateEditor';
import { Plus, Trash2, ChevronDown, ChevronUp, GripVertical } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

interface DynamicFieldProps {
  field: Field;
  path: string;
}

const DynamicField: React.FC<DynamicFieldProps> = ({ field, path }) => {
  const { register, formState: { errors } } = useFormContext();
  const error = (errors as any)?.[path.split('.')[0]]?.[path.split('.')[1]]?.[field.name] || 
                (errors as any)?.[path.split('.')[0]]?.[field.name];

  const fieldId = `${path}.${field.name}`;

  return (
    <div className={cn("space-y-1.5", field.ui?.grid)}>
      <label htmlFor={fieldId} className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {field.label} {field.required && <span className="text-destructive">*</span>}
      </label>
      
      {field.type === 'textarea' ? (
        <Textarea
          id={fieldId}
          placeholder={field.placeholder}
          rows={field.ui?.rows || 3}
          {...register(fieldId)}
          className={cn(error && "border-red-500 focus-visible:ring-red-500")}
        />
      ) : (
        <Input
          id={fieldId}
          type={field.type}
          placeholder={field.placeholder}
          {...register(fieldId)}
          className={cn(error && "border-red-500 focus-visible:ring-red-500")}
        />
      )}
      
      {error && (
        <p className="text-[11px] font-medium text-destructive">
          {error.message}
        </p>
      )}
    </div>
  );
};

interface SectionWrapperProps {
  section: Section;
  children: React.ReactNode;
}

const SectionWrapper: React.FC<SectionWrapperProps> = ({ section, children }) => {
  const [isOpen, setIsOpen] = React.useState(true);

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all hover:shadow-md">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between bg-muted/50 px-6 py-4 text-left transition-colors hover:bg-muted"
      >
        <div>
          <h3 className="text-lg font-bold text-foreground">{section.label}</h3>
          {section.ui?.description && (
            <p className="text-xs text-muted-foreground">{section.ui.description}</p>
          )}
        </div>
        {isOpen ? <ChevronDown className="h-5 w-5 text-muted-foreground/60" /> : <ChevronUp className="h-5 w-5 text-muted-foreground/60" />}
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="p-6">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const ResumeFormSection: React.FC<{ section: Section }> = ({ section }) => {
  const { control } = useFormContext();

  if (section.type === 'array') {
    const { fields, append, remove, move } = useFieldArray({
      control,
      name: section.key,
    });

    const handleAdd = () => {
      const newItem: any = {};
      section.fields.forEach(f => newItem[f.name] = '');
      append(newItem);
    };

    return (
      <SectionWrapper section={section}>
        <div className="space-y-6">
          <AnimatePresence mode="popLayout">
            {fields.map((field, index) => (
              <motion.div
                key={field.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative space-y-4 rounded-lg border border-border/50 bg-muted/30 p-4"
              >
                <div className="flex items-center justify-between border-b border-border/50 pb-2">
                  <span className="text-xs font-bold uppercase text-muted-foreground/60">
                    {section.label} #{index + 1}
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => remove(index)}
                    className="h-8 w-8 text-muted-foreground/60 hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className={cn("grid gap-4", section.ui?.columns === 2 ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1")}>
                  {section.fields.map((f) => (
                    <DynamicField
                      key={f.name}
                      field={f}
                      path={`${section.key}.${index}`}
                    />
                  ))}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          <Button
            type="button"
            variant="outline"
            onClick={handleAdd}
            className="w-full border-dashed border-border py-6 text-muted-foreground hover:border-foreground hover:bg-muted hover:text-foreground"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add {section.label}
          </Button>
        </div>
      </SectionWrapper>
    );
  }

  return (
    <SectionWrapper section={section}>
      <div className={cn("grid gap-4", section.ui?.columns === 2 ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1")}>
        {section.fields.map((f) => (
          <DynamicField
            key={f.name}
            field={f}
            path={section.key}
          />
        ))}
      </div>
    </SectionWrapper>
  );
};
