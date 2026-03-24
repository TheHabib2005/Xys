import React from 'react';


import { Trash2, Plus, Settings2, GripVertical, ChevronRight, ChevronDown, Layout } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Section } from '@/interfaces/templateEditor';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';


interface SchemaEditorProps {
  schema: Section[];
  onSchemaChange: (newSchema: Section[]) => void;
}

export const SchemaEditor: React.FC<SchemaEditorProps> = ({ schema, onSchemaChange }) => {
  const [expandedSection, setExpandedSection] = React.useState<string | null>(schema[0]?.key || null);

  const addSection = () => {
    const key = `section_${Math.random().toString(36).substr(2, 5)}`;
    const newSection: Section = {
      key,
      type: 'object',
      label: 'New Section',
      order: schema.length + 1,
      fields: [],
      ui: { columns: 1 }
    };
    onSchemaChange([...schema, newSection]);
    setExpandedSection(key);
  };

  const removeSection = (key: string) => {
    onSchemaChange(schema.filter(s => s.key !== key));
    if (expandedSection === key) setExpandedSection(null);
  };

  const updateSection = (key: string, updates: Partial<Section>) => {
    onSchemaChange(schema.map(s => s.key === key ? { ...s, ...updates } : s));
    // If the key itself is being updated, update the expandedSection state to match
    if (updates.key && expandedSection === key) {
      setExpandedSection(updates.key);
    }
  };

  const addField = (sectionKey: string) => {
    const section = schema.find(s => s.key === sectionKey);
    if (!section) return;

    const name = `field_${Math.random().toString(36).substr(2, 5)}`;
    const newField: Field = {
      name,
      type: 'text',
      label: 'New Field',
      required: false,
      placeholder: 'Enter text...'
    };
    updateSection(sectionKey, { fields: [...section.fields, newField] });
  };

  const removeField = (sectionKey: string, fieldName: string) => {
    const section = schema.find(s => s.key === sectionKey);
    if (!section) return;
    updateSection(sectionKey, { fields: section.fields.filter(f => f.name !== fieldName) });
  };

  const updateField = (sectionKey: string, fieldName: string, updates: Partial<Field>) => {
    const section = schema.find(s => s.key === sectionKey);
    if (!section) return;
    const newFields = section.fields.map(f => f.name === fieldName ? { ...f, ...updates } : f);
    updateSection(sectionKey, { fields: newFields });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black uppercase tracking-tight text-foreground">Template Structure</h2>
          <p className="text-sm font-medium text-muted-foreground">Define sections and fields for your resume template.</p>
        </div>
        <Button onClick={addSection} className="gap-2 shadow-lg shadow-primary/20">
          <Plus className="h-4 w-4" /> Add Section
        </Button>
      </div>

      {schema.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-border bg-card py-20 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
            <Layout className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-bold text-foreground">No sections yet</h3>
          <p className="mb-6 max-w-xs text-sm text-muted-foreground">Start by adding a section like "Header" or "Experience" to your template.</p>
          <Button onClick={addSection} variant="outline" className="gap-2">
            <Plus className="h-4 w-4" /> Create First Section
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {schema.map((section, sIdx) => (
            <motion.div
              key={sIdx} // Using index as key for stable editing of 'key' property
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "overflow-hidden rounded-2xl border transition-all duration-300",
                expandedSection === section.key 
                  ? "border-primary/30 bg-card shadow-xl shadow-primary/5" 
                  : "border-border bg-card hover:border-foreground/20"
              )}
            >
              <div 
                className={cn(
                  "flex cursor-pointer items-center justify-between p-5",
                  expandedSection === section.key && "bg-primary/5"
                )}
                onClick={() => setExpandedSection(expandedSection === section.key ? null : section.key)}
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                    <GripVertical className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground">{section.label || 'Untitled Section'}</h3>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60">{section.type}</span>
                      <span className="h-1 w-1 rounded-full bg-border" />
                      <span className="text-[10px] font-mono text-primary">{section.key}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => { e.stopPropagation(); removeSection(section.key); }}
                    className="h-8 w-8 text-muted-foreground/60 hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <ChevronDown className={cn("h-5 w-5 text-muted-foreground/60 transition-transform", expandedSection === section.key && "rotate-180")} />
                </div>
              </div>

              <AnimatePresence>
                {expandedSection === section.key && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-border/50 p-6"
                  >
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Section Label</label>
                        <Input 
                          value={section.label} 
                          onChange={(e) => updateSection(section.key, { label: e.target.value })}
                          placeholder="e.g. Work Experience"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Data Key (Unique)</label>
                        <Input 
                          value={section.key} 
                          onChange={(e) => updateSection(section.key, { key: e.target.value })}
                          placeholder="e.g. experience"
                          className="font-mono text-primary"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Section Type</label>
                        <select 
                          value={section.type}
                          onChange={(e) => updateSection(section.key, { type: e.target.value as any })}
                          className="w-full rounded-xl border border-input bg-muted px-4 py-2 text-sm font-medium transition-all focus:border-primary focus:bg-background focus:ring-2 focus:ring-primary/20"
                        >
                          <option value="object">Single Object (Header, Summary)</option>
                          <option value="array">List / Array (Experience, Education)</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Layout Columns</label>
                        <Input 
                          type="number"
                          value={section.ui.columns} 
                          onChange={(e) => updateSection(section.key, { ui: { ...section.ui, columns: parseInt(e.target.value) } })}
                        />
                      </div>
                      <div className="col-span-full space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Description / Instructions</label>
                        <Textarea 
                          value={section.ui.description} 
                          onChange={(e) => updateSection(section.key, { ui: { ...section.ui, description: e.target.value } })}
                          placeholder="Instructions for the user..."
                          rows={2}
                        />
                      </div>
                    </div>

                    <div className="mt-8 space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Fields Configuration</h4>
                        <Button onClick={() => addField(section.key)} variant="outline" size="sm" className="h-8 gap-2 text-[10px] font-bold uppercase">
                          <Plus className="h-3 w-3" /> Add Field
                        </Button>
                      </div>

                      <div className="space-y-3">
                        {section.fields.map((field, fIdx) => (
                          <div key={fIdx} className="group relative rounded-xl border border-border/50 bg-muted/50 p-4 transition-all hover:border-primary/20 hover:bg-card hover:shadow-md">
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-12">
                              <div className="sm:col-span-3 space-y-1">
                                <label className="text-[9px] font-bold uppercase text-muted-foreground">Label</label>
                                <Input 
                                  value={field.label} 
                                  onChange={(e) => updateField(section.key, field.name, { label: e.target.value })}
                                  className="h-8 text-xs"
                                />
                              </div>
                              <div className="sm:col-span-3 space-y-1">
                                <label className="text-[9px] font-bold uppercase text-muted-foreground">Name (Key)</label>
                                <Input 
                                  value={field.name} 
                                  onChange={(e) => updateField(section.key, field.name, { name: e.target.value })}
                                  className="h-8 font-mono text-[10px] text-primary"
                                />
                              </div>
                              <div className="sm:col-span-2 space-y-1">
                                <label className="text-[9px] font-bold uppercase text-muted-foreground">Type</label>
                                <select 
                                  value={field.type}
                                  onChange={(e) => updateField(section.key, field.name, { type: e.target.value as any })}
                                  className="w-full rounded-lg border border-input bg-background px-2 py-1 text-[10px] font-bold transition-all focus:border-primary"
                                >
                                  <option value="text">Text</option>
                                  <option value="textarea">Textarea</option>
                                  <option value="email">Email</option>
                                  <option value="url">URL</option>
                                  <option value="tel">Phone</option>
                                  <option value="date">Date</option>
                                  <option value="select">Select</option>
                                </select>
                              </div>
                              <div className="sm:col-span-3 space-y-1">
                                <label className="text-[9px] font-bold uppercase text-muted-foreground">Placeholder</label>
                                <Input 
                                  value={field.placeholder} 
                                  onChange={(e) => updateField(section.key, field.name, { placeholder: e.target.value })}
                                  className="h-8 text-xs"
                                />
                              </div>
                              <div className="sm:col-span-1 flex items-end justify-end pb-1">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => removeField(section.key, field.name)}
                                  className="h-8 w-8 text-muted-foreground/40 hover:text-destructive"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                              </div>

                              {field.type === 'select' && (
                                <div className="sm:col-span-full mt-2 space-y-1">
                                  <label className="text-[9px] font-bold uppercase text-muted-foreground">Options (Comma separated)</label>
                                  <Input 
                                    value={field.options?.join(', ')} 
                                    onChange={(e) => updateField(section.key, field.name, { options: e.target.value.split(',').map(o => o.trim()) })}
                                    placeholder="Option 1, Option 2, Option 3"
                                    className="h-8 text-xs"
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};
