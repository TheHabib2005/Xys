import React from 'react';
import { Section, Field } from '@/interfaces/templateEditor';

import { Trash2, Plus, Settings2, GripVertical, ChevronRight, ChevronDown, Layout } from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';


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
          <h2 className="text-2xl font-black uppercase tracking-tight text-slate-900">Template Structure</h2>
          <p className="text-sm font-medium text-slate-500">Define sections and fields for your resume template.</p>
        </div>
        <Button onClick={addSection} className="gap-2 bg-indigo-600 shadow-lg shadow-indigo-200 hover:bg-indigo-700">
          <Plus className="h-4 w-4" /> Add Section
        </Button>
      </div>

      {schema.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-200 bg-white py-20 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-50 text-slate-400">
            <Layout className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">No sections yet</h3>
          <p className="mb-6 max-w-xs text-sm text-slate-500">Start by adding a section like "Header" or "Experience" to your template.</p>
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
                  ? "border-indigo-200 bg-white shadow-xl shadow-indigo-50" 
                  : "border-slate-200 bg-white hover:border-slate-300"
              )}
            >
              <div 
                className={cn(
                  "flex cursor-pointer items-center justify-between p-5",
                  expandedSection === section.key && "bg-indigo-50/30"
                )}
                onClick={() => setExpandedSection(expandedSection === section.key ? null : section.key)}
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
                    <GripVertical className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">{section.label || 'Untitled Section'}</h3>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{section.type}</span>
                      <span className="h-1 w-1 rounded-full bg-slate-300" />
                      <span className="text-[10px] font-mono text-indigo-500">{section.key}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => { e.stopPropagation(); removeSection(section.key); }}
                    className="h-8 w-8 text-slate-400 hover:bg-red-50 hover:text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <ChevronDown className={cn("h-5 w-5 text-slate-400 transition-transform", expandedSection === section.key && "rotate-180")} />
                </div>
              </div>

              <AnimatePresence>
                {expandedSection === section.key && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-slate-100 p-6"
                  >
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Section Label</label>
                        <Input 
                          value={section.label} 
                          onChange={(e) => updateSection(section.key, { label: e.target.value })}
                          placeholder="e.g. Work Experience"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Data Key (Unique)</label>
                        <Input 
                          value={section.key} 
                          onChange={(e) => updateSection(section.key, { key: e.target.value })}
                          placeholder="e.g. experience"
                          className="font-mono text-indigo-600"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Section Type</label>
                        <select 
                          value={section.type}
                          onChange={(e) => updateSection(section.key, { type: e.target.value as any })}
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium transition-all focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200"
                        >
                          <option value="object">Single Object (Header, Summary)</option>
                          <option value="array">List / Array (Experience, Education)</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Layout Columns</label>
                        <Input 
                          type="number"
                          value={section?.ui.columns} 
                          onChange={(e) => updateSection(section.key, { ui: { ...section.ui, columns: parseInt(e.target.value) } })}
                        />
                      </div>
                      <div className="col-span-full space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Description / Instructions</label>
                        <Textarea 
                          value={section?.ui.description} 
                          onChange={(e) => updateSection(section.key, { ui: { ...section.ui, description: e.target.value } })}
                          placeholder="Instructions for the user..."
                          rows={2}
                        />
                      </div>
                    </div>

                    <div className="mt-8 space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">Fields Configuration</h4>
                        <Button onClick={() => addField(section.key)} variant="outline" size="sm" className="h-8 gap-2 text-[10px] font-bold uppercase">
                          <Plus className="h-3 w-3" /> Add Field
                        </Button>
                      </div>

                      <div className="space-y-3">
                        {section.fields.map((field, fIdx) => (
                          <div key={fIdx} className="group relative rounded-xl border border-slate-100 bg-slate-50/50 p-4 transition-all hover:border-indigo-100 hover:bg-white hover:shadow-md">
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-12">
                              <div className="sm:col-span-3 space-y-1">
                                <label className="text-[9px] font-bold uppercase text-slate-400">Label</label>
                                <Input 
                                  value={field.label} 
                                  onChange={(e) => updateField(section.key, field.name, { label: e.target.value })}
                                  className="h-8 text-xs"
                                />
                              </div>
                              <div className="sm:col-span-3 space-y-1">
                                <label className="text-[9px] font-bold uppercase text-slate-400">Name (Key)</label>
                                <Input 
                                  value={field.name} 
                                  onChange={(e) => updateField(section.key, field.name, { name: e.target.value })}
                                  className="h-8 font-mono text-[10px] text-indigo-600"
                                />
                              </div>
                              <div className="sm:col-span-2 space-y-1">
                                <label className="text-[9px] font-bold uppercase text-slate-400">Type</label>
                                <select 
                                  value={field.type}
                                  onChange={(e) => updateField(section.key, field.name, { type: e.target.value as any })}
                                  className="w-full rounded-lg border border-slate-200 bg-white px-2 py-1 text-[10px] font-bold transition-all focus:border-indigo-500"
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
                                <label className="text-[9px] font-bold uppercase text-slate-400">Placeholder</label>
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
                                  className="h-8 w-8 text-slate-300 hover:text-red-500"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                              </div>

                              {field.type === 'select' && (
                                <div className="sm:col-span-full mt-2 space-y-1">
                                  <label className="text-[9px] font-bold uppercase text-slate-400">Options (Comma separated)</label>
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
