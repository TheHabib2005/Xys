import React from 'react';
import { Check } from 'lucide-react';
import { allTemplates, type ResumeTemplate } from '@/lib/templates';

interface TemplateSelectorProps {
  selectedId: string;
  onSelect: (template: ResumeTemplate) => void;
}

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({ selectedId, onSelect }) => {
  return (
    <div className="grid grid-cols-3 gap-3">
      {allTemplates.map(template => {
        const isActive = template.id === selectedId;
        return (
          <button
            key={template.id}
            type="button"
            onClick={() => onSelect(template)}
            className={`
              relative flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all text-left
              ${isActive
                ? 'border-primary bg-primary/5 shadow-sm'
                : 'border-border hover:border-foreground/20 hover:bg-muted/50'
              }
            `}
          >
            {isActive && (
              <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                <Check className="w-3 h-3 text-primary-foreground" />
              </div>
            )}
            <div
              className="w-full aspect-[3/4] rounded-md border border-border"
              style={{ background: `linear-gradient(135deg, ${template.color}15, ${template.color}05)` }}
            >
              <div className="p-3 space-y-1.5">
                <div className="h-2 rounded-full w-3/4" style={{ background: template.color }} />
                <div className="h-1.5 rounded-full bg-border w-full" />
                <div className="h-1.5 rounded-full bg-border w-2/3" />
                <div className="mt-2 h-1 rounded-full bg-border w-full" />
                <div className="h-1 rounded-full bg-border w-5/6" />
                <div className="h-1 rounded-full bg-border w-full" />
              </div>
            </div>
            <div className="w-full">
              <p className="text-xs font-semibold text-foreground">{template.name}</p>
              <p className="text-[10px] text-muted-foreground leading-tight mt-0.5">{template.description}</p>
            </div>
          </button>
        );
      })}
    </div>
  );
};
