import React from 'react';
import { Layout } from 'lucide-react';
import { ResumeSchema, Section } from"@/interfaces/templateEditor";
import { cn } from '@/lib/utils';

interface PreviewProps {
  data: any;
  schema: ResumeSchema;
}

const ResumePreview: React.FC<PreviewProps> = ({ data, schema }) => {
  const sortedSchema = [...schema].sort((a, b) => a.order - b.order);

  if (schema.length === 0) {
    return (
      <div className="flex min-h-[600px] w-full items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-white p-12 text-center">
        <div className="max-w-sm">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
            <Layout className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Preview is empty</h3>
          <p className="text-sm text-slate-500">Add sections to your template in the editor to see them rendered here.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[800px] bg-white p-8 shadow-2xl sm:p-12 min-h-[1122px]">
      <div className="space-y-10">
        {sortedSchema.map((section, idx) => {
          const sectionData = data[section.key];
          if (!sectionData) return null;

          // Special handling for Header (usually the first section and must be an object)
          if ((section.key === 'header' || idx === 0) && section.type === 'object') {
            return (
              <header key={section.key} className="border-b-2 border-slate-900 pb-8 text-center">
                <h1 className="text-4xl font-black uppercase tracking-tighter text-slate-900">
                  {sectionData.fullName || sectionData[section.fields[0]?.name] || 'Your Name'}
                </h1>
                <p className="mt-2 text-lg font-bold uppercase tracking-widest text-indigo-600">
                  {sectionData.jobTitle || sectionData[section.fields[1]?.name] || 'Professional Title'}
                </p>
                <div className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm font-medium text-slate-600">
                  {section.fields.filter(f => f.name !== 'fullName' && f.name !== 'jobTitle').map(field => {
                    const val = sectionData[field.name];
                    if (!val) return null;
                    return (
                      <div key={field.name} className="flex items-center gap-2">
                        <span className="h-1 w-1 rounded-full bg-slate-300" />
                        {val}
                      </div>
                    );
                  })}
                </div>
              </header>
            );
          }

          return (
            <section key={section.key} className="space-y-4">
              <div className="flex items-center gap-4">
                <h2 className="whitespace-nowrap text-sm font-black uppercase tracking-[0.2em] text-slate-900">
                  {section.label}
                </h2>
                <div className="h-[1px] w-full bg-slate-200" />
              </div>

              {section.type === 'array' ? (
                <div className="space-y-6">
                  {Array.isArray(sectionData) && sectionData.map((item, iIdx) => (
                    <div key={iIdx} className="grid gap-4" style={{ gridTemplateColumns: `repeat(${section.ui.columns || 1}, minmax(0, 1fr))` }}>
                      {section.fields.map(field => {
                        const val = item[field.name];
                        if (!val) return null;
                        return (
                          <div key={field.name} className={cn(field.ui?.grid || "col-span-1")}>
                            {field.label && <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-slate-400">{field.label}</p>}
                            <div className={cn(
                              "text-sm leading-relaxed text-slate-700",
                              field.type === 'textarea' ? "whitespace-pre-wrap" : ""
                            )}>
                              {val}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${section.ui.columns || 1}, minmax(0, 1fr))` }}>
                  {section.fields.map(field => {
                    const val = sectionData[field.name];
                    if (!val) return null;
                    return (
                      <div key={field.name} className={cn(field.ui?.grid || "col-span-1")}>
                        {field.label && <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-slate-400">{field.label}</p>}
                        <div className={cn(
                          "text-sm leading-relaxed text-slate-700",
                          field.type === 'textarea' ? "whitespace-pre-wrap" : ""
                        )}>
                          {val}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
};

export default ResumePreview;
