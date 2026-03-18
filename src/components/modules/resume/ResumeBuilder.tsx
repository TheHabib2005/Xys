"use client";

import React, { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  useForm,
  useFieldArray,
  FormProvider,
  useFormContext,
  FieldErrors,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import Handlebars from "handlebars";
import { format } from "date-fns";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  ArrowLeft,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Save,
  Trash2,
  Plus,
  Check,
  AlertCircle,
  Download,
  Cloud,
  CloudOff,
  Bold,
  Italic,
  List,
  ListOrdered,
  Upload,
  X,
  Eye,
  EyeOff,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

import { useApiQuery } from "@/hooks/useApiQuery";
import { SkeletonBuilder } from "./SkelectionBuilder";
import { toast } from "sonner";
import { ResumeTemplate } from "@/interfaces/template";

// ------------------------------------------------------------
// Deep comparison helper (unchanged)
// ------------------------------------------------------------
function deepEqual(obj1: any, obj2: any): boolean {
  if (obj1 === obj2) return true;
  if (typeof obj1 !== "object" || obj1 === null || typeof obj2 !== "object" || obj2 === null)
    return false;
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  if (keys1.length !== keys2.length) return false;
  for (const key of keys1) {
    if (!keys2.includes(key)) return false;
    if (!deepEqual(obj1[key], obj2[key])) return false;
  }
  return true;
}

// ------------------------------------------------------------
// Rich Text Editor Component (TipTap)
// ------------------------------------------------------------
const RichTextEditor = ({ value, onChange, placeholder, className }: any) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose-base dark:prose-invert focus:outline-none min-h-[120px] p-3",
      },
    },
    immediatelyRender:false
  });

  // Update editor content when value changes externally
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  if (!editor) return null;

  return (
    <div className={`border rounded-lg overflow-hidden ${className}`}>
      <div className="flex items-center gap-1 p-2 bg-zinc-50 dark:bg-zinc-900 border-b">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className={`h-8 w-8 ${editor.isActive("bold") ? "bg-zinc-200 dark:bg-zinc-700" : ""}`}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className={`h-8 w-8 ${editor.isActive("italic") ? "bg-zinc-200 dark:bg-zinc-700" : ""}`}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className={`h-8 w-8 ${editor.isActive("bulletList") ? "bg-zinc-200 dark:bg-zinc-700" : ""}`}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className={`h-8 w-8 ${editor.isActive("orderedList") ? "bg-zinc-200 dark:bg-zinc-700" : ""}`}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
      </div>
      <EditorContent editor={editor} className="bg-white dark:bg-zinc-950" />
    </div>
  );
};

// ------------------------------------------------------------
// File Upload Component (base64 with loading)
// ------------------------------------------------------------
const FileUpload = ({ value, onChange, accept, placeholder }: any) => {
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(value || null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setPreview(base64);
      onChange(base64);
      setLoading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleRemove = () => {
    setPreview(null);
    onChange(undefined);
  };

  return (
    <div className="space-y-2">
      {preview ? (
        <div className="relative inline-block">
          {accept?.includes("image") ? (
            <img
              src={preview}
              alt="Preview"
              className="max-w-full h-32 rounded-lg object-cover border"
            />
          ) : (
            <div className="p-4 border rounded-lg bg-zinc-50 dark:bg-zinc-900">
              <span className="text-sm">File uploaded</span>
            </div>
          )}
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
            onClick={handleRemove}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            className="relative"
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Upload className="h-4 w-4 mr-2" />
            )}
            {placeholder || "Upload file"}
            <input
              type="file"
              className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={handleFileChange}
              accept={accept}
              disabled={loading}
            />
          </Button>
        </div>
      )}
    </div>
  );
};

// ------------------------------------------------------------
// Multi-Select Component (Popover with checkboxes)
// ------------------------------------------------------------
const MultiSelect = ({ options, value, onChange, placeholder }: any) => {
  const [open, setOpen] = useState(false);
  const selectedValues = value || [];

  const toggleOption = (optionValue: any) => {
    const newValue = selectedValues.includes(optionValue)
      ? selectedValues.filter((v: any) => v !== optionValue)
      : [...selectedValues, optionValue];
    onChange(newValue);
  };

  const selectedLabels = options
    .filter((opt: any) => selectedValues.includes(opt.value))
    .map((opt: any) => opt.label)
    .join(", ");

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-start h-11 font-normal"
        >
          {selectedLabels || placeholder || "Select options"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <div className="p-2">
          {options.map((option: any) => (
            <div key={option.value} className="flex items-center space-x-2 py-1">
              <Checkbox
                id={option.value}
                checked={selectedValues.includes(option.value)}
                onCheckedChange={() => toggleOption(option.value)}
              />
              <Label htmlFor={option.value} className="text-sm font-normal cursor-pointer">
                {option.label}
              </Label>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

// ------------------------------------------------------------
// Conditional Logic Hook
// ------------------------------------------------------------
const useCondition = (condition: any, formValues: any) => {
  return useMemo(() => {
    if (!condition) return true;
    const { field, operator, value } = condition;
    // Simple path resolution (supports dot notation and array indices)
    const resolveValue = (path: string): any => {
      return path.split('.').reduce((obj, key) => {
        if (obj === undefined || obj === null) return undefined;
        // Handle array indices like `experience[0].company`
        const match = key.match(/([^\[]+)\[(\d+)\]/);
        if (match) {
          const [, fieldName, index] = match;
          return obj[fieldName]?.[parseInt(index)];
        }
        return obj[key];
      }, formValues);
    };

    const fieldValue = resolveValue(field);
    switch (operator) {
      case 'eq': return fieldValue === value;
      case 'neq': return fieldValue !== value;
      case 'gt': return fieldValue > value;
      case 'lt': return fieldValue < value;
      case 'contains': return Array.isArray(fieldValue) ? fieldValue.includes(value) : String(fieldValue).includes(value);
      case 'notContains': return !String(fieldValue).includes(value);
      case 'empty': return !fieldValue || (Array.isArray(fieldValue) && fieldValue.length === 0);
      case 'notEmpty': return !!fieldValue && (!Array.isArray(fieldValue) || fieldValue.length > 0);
      default: return true;
    }
  }, [condition, formValues]);
};

// ------------------------------------------------------------
// Conditional Wrapper
// ------------------------------------------------------------
const ConditionalWrapper = ({ condition, formValues, children }: any) => {
  const shouldRender = useCondition(condition, formValues);
  return shouldRender ? children : null;
};

// ------------------------------------------------------------
// FieldRenderer – recursive component for all field types
// ------------------------------------------------------------
const FieldRenderer = ({ field, sectionKey, index, path }: any) => {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
    control,
  } = useFormContext();

  // Build full field path
  const basePath = index !== undefined ? `${sectionKey}.${index}` : sectionKey;
  const fieldPath = path ? `${basePath}.${path}.${field.name}` : `${basePath}.${field.name}`;

  const error = fieldPath
    .split(".")
    .reduce((obj: any, key: string) => obj?.[key], errors as any);

  const currentValue = watch(fieldPath);
  const ui = field.ui || {};

  // Conditionally render
  if (field.condition) {
    const shouldRender = useCondition(field.condition, watch());
    if (!shouldRender) return null;
  }

  // Helper to set value with validation
  const handleChange = (value: any) => {
    setValue(fieldPath, value, { shouldValidate: true, shouldDirty: true });
  };

  // Grid classes
  const gridClass = ui.grid || "col-span-2";

  // Character count display
  const showCount = ui.showCount && (field.type === 'text' || field.type === 'textarea');

  return (
    <div className={`space-y-2 ${gridClass}`}>
      <div className="flex items-center justify-between">
        <Label
          className={`text-sm font-medium ${
            error ? "text-destructive" : "text-zinc-700 dark:text-zinc-300"
          }`}
        >
          {field.label || field.name}
          {field.required && <span className="text-destructive ml-1">*</span>}
        </Label>
        {showCount && (
          <span className="text-xs text-zinc-400">
            {currentValue?.length || 0}/{ui.maxLength || "∞"}
          </span>
        )}
      </div>

      {/* Field type switch */}
      {field.type === "text" && (
        <Input
          type="text"
          {...register(fieldPath)}
          placeholder={field.placeholder}
          className={`h-11 rounded-lg border ${
            error ? "border-destructive" : "border-zinc-300 dark:border-zinc-700"
          }`}
        />
      )}

      {field.type === "email" && (
        <Input
          type="email"
          {...register(fieldPath)}
          placeholder={field.placeholder}
          className={`h-11 rounded-lg border ${
            error ? "border-destructive" : "border-zinc-300 dark:border-zinc-700"
          }`}
        />
      )}

      {field.type === "url" && (
        <Input
          type="url"
          {...register(fieldPath)}
          placeholder={field.placeholder}
          className={`h-11 rounded-lg border ${
            error ? "border-destructive" : "border-zinc-300 dark:border-zinc-700"
          }`}
        />
      )}

      {field.type === "tel" && (
        <Input
          type="tel"
          {...register(fieldPath)}
          placeholder={field.placeholder}
          className={`h-11 rounded-lg border ${
            error ? "border-destructive" : "border-zinc-300 dark:border-zinc-700"
          }`}
        />
      )}

      {field.type === "number" && (
        <Input
          type="number"
          {...register(fieldPath, { valueAsNumber: true })}
          placeholder={field.placeholder}
          className={`h-11 rounded-lg border ${
            error ? "border-destructive" : "border-zinc-300 dark:border-zinc-700"
          }`}
        />
      )}

      {field.type === "textarea" && (
        <Textarea
          {...register(fieldPath)}
          placeholder={field.placeholder}
          rows={ui.rows || 3}
          className={`rounded-lg resize-none border ${
            error ? "border-destructive" : "border-zinc-300 dark:border-zinc-700"
          }`}
        />
      )}

      {field.type === "richtext" && (
        <RichTextEditor
          value={currentValue || ""}
          onChange={(val: string) => handleChange(val)}
          placeholder={field.placeholder}
          className={error ? "border-destructive" : ""}
        />
      )}

      {field.type === "date" && (
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={`w-full justify-start rounded-lg h-11 text-left font-normal ${
                error ? "border-destructive" : ""
              }`}
            >
              {currentValue ? format(new Date(currentValue), "PPP") : "Pick date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-0">
            <Calendar
              mode="single"
              selected={currentValue ? new Date(currentValue) : undefined}
              onSelect={(date) => handleChange(date?.toISOString())}
            />
          </PopoverContent>
        </Popover>
      )}

      {field.type === "checkbox" && (
        <div className="flex items-center space-x-2">
          <Checkbox
            id={fieldPath}
            checked={currentValue || false}
            onCheckedChange={(checked) => handleChange(checked)}
          />
          <Label htmlFor={fieldPath} className="text-sm font-normal cursor-pointer">
            {field.label}
          </Label>
        </div>
      )}

      {field.type === "radio" && (
        <RadioGroup
          value={currentValue}
          onValueChange={handleChange}
          className="flex flex-col space-y-1"
        >
          {(ui.options || field.options || []).map((opt: any) => {
            const optValue = typeof opt === 'string' ? opt : opt.value;
            const optLabel = typeof opt === 'string' ? opt : opt.label;
            return (
              <div key={optValue} className="flex items-center space-x-2">
                <RadioGroupItem value={optValue} id={`${fieldPath}-${optValue}`} />
                <Label htmlFor={`${fieldPath}-${optValue}`} className="text-sm font-normal cursor-pointer">
                  {optLabel}
                </Label>
              </div>
            );
          })}
        </RadioGroup>
      )}

      {field.type === "select" && (
        <Select onValueChange={handleChange} value={currentValue}>
          <SelectTrigger className={`rounded-lg border ${
            error ? "border-destructive" : "border-zinc-300 dark:border-zinc-700"
          }`}>
            <SelectValue placeholder={field.placeholder || "Select..."} />
          </SelectTrigger>
          <SelectContent>
            {(ui.options || field.options || []).map((opt: any) => {
              const optValue = typeof opt === 'string' ? opt : opt.value;
              const optLabel = typeof opt === 'string' ? opt : opt.label;
              return (
                <SelectItem key={optValue} value={optValue}>
                  {optLabel}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      )}

      {field.type === "multiselect" && (
        <MultiSelect
          options={ui.options || field.options || []}
          value={currentValue || []}
          onChange={handleChange}
          placeholder={field.placeholder}
        />
      )}

      {field.type === "file" && (
        <FileUpload
          value={currentValue}
          onChange={handleChange}
          accept={ui.accept}
          placeholder={field.placeholder}
        />
      )}

      {field.type === "group" && (
        <div className="space-y-4 border-l-2 border-zinc-200 dark:border-zinc-700 pl-4">
          {field.fields?.map((subField: any) => (
            <FieldRenderer
              key={subField.name}
              field={subField}
              sectionKey={sectionKey}
              index={index}
              path={field.name} // to build nested path
            />
          ))}
        </div>
      )}

      {field.type === "array" && (
        <ArrayField field={field} sectionKey={sectionKey} index={index} path={field.name} />
      )}

      {error && <p className="text-xs text-destructive">{error.message}</p>}
      {field.helpText && !error && <p className="text-xs text-zinc-400">{field.helpText}</p>}
    </div>
  );
};

// ------------------------------------------------------------
// ArrayField – for repeatable groups inside a section or another array
// ------------------------------------------------------------
const ArrayField = ({ field, sectionKey, index, path }: any) => {
  const { control } = useFormContext();
  const basePath = index !== undefined ? `${sectionKey}.${index}` : sectionKey;
  const arrayPath = path ? `${basePath}.${path}` : `${basePath}.${field.name}`;

  const { fields, append, remove } = useFieldArray({
    control,
    name: arrayPath,
  });

  return (
    <div className="space-y-4">
      {fields.map((item, idx) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          className="relative p-4 border rounded-xl bg-white dark:bg-zinc-900 shadow-sm border-zinc-200 dark:border-zinc-800"
        >
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute -top-2 -right-2 h-7 w-7 rounded-full bg-white dark:bg-zinc-800 border shadow-sm text-destructive"
            onClick={() => remove(idx)}
          >
            <Trash2 className="h-3 w-3" />
          </Button>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {field.fields?.map((subField: any) => (
              <FieldRenderer
                key={subField.name}
                field={subField}
                sectionKey={arrayPath}
                index={idx}
                // No path because we're already inside the array item; subField.name will be used directly
              />
            ))}
          </div>
        </motion.div>
      ))}

      <Button
        type="button"
        variant="outline"
        className="w-full border-dashed border-2 py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all"
        onClick={() => append({})}
      >
        <Plus className="h-4 w-4" />
        <span className="text-sm font-medium">Add item</span>
      </Button>
    </div>
  );
};

// ------------------------------------------------------------
// Section component (object or array)
// ------------------------------------------------------------
const SectionRenderer = ({ section }: { section: any }) => {
  const { watch } = useFormContext();
  const formValues = watch();

  // Section-level condition
  if (section.condition) {
    const shouldRender = useCondition(section.condition, formValues);
    if (!shouldRender) return null;
  }

  const columns = section.ui?.columns || 2;

  return (
    <div className="space-y-6">
      {section.ui?.description && (
        <p className="text-sm text-zinc-500 dark:text-zinc-400">{section.ui.description}</p>
      )}

      {section.type === "array" ? (
        <ArraySectionContent section={section} />
      ) : (
        <div className={`grid grid-cols-1 sm:grid-cols-${columns} gap-4`}>
          {section.fields.map((field: any) => (
            <FieldRenderer
              key={field.name}
              field={field}
              sectionKey={section.key}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// Content for array sections (existing ArraySection but using FieldRenderer)
const ArraySectionContent = ({ section }: any) => {
  const { control } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: section.key,
  });

  const columns = section.ui?.columns || 2;

  return (
    <div className="space-y-6">
      {fields.map((item, index) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          className="relative p-4 sm:p-6 border rounded-2xl bg-white dark:bg-zinc-900 shadow-sm border-zinc-200 dark:border-zinc-800"
        >
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute -top-3 -right-3 h-8 w-8 rounded-full bg-white dark:bg-zinc-800 border shadow-sm text-destructive"
            onClick={() => remove(index)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>

          <div className={`grid grid-cols-1 sm:grid-cols-${columns} gap-4`}>
            {section.fields.map((field: any) => (
              <FieldRenderer
                key={field.name}
                field={field}
                sectionKey={section.key}
                index={index}
              />
            ))}
          </div>
        </motion.div>
      ))}

      <Button
        type="button"
        variant="outline"
        className="w-full border-dashed border-2 py-4 sm:py-6 rounded-2xl flex flex-col gap-2 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all"
        onClick={() => append({})}
      >
        <Plus className="h-5 w-5 text-zinc-400" />
        <span className="text-sm font-bold text-zinc-500">
          Add entry to {section.label}
        </span>
      </Button>
    </div>
  );
};

// ------------------------------------------------------------
// Preview Component (unchanged)
// ------------------------------------------------------------
const ResumePreview = ({ template, data }: { template: any; data: any }) => {
  const [compiledHtml, setCompiledHtml] = useState("");
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (!template?.htmlLayout) return;
    try {
      const compile = Handlebars.compile(template.htmlLayout);
      const html = compile(data);
      setCompiledHtml(html);
    } catch (err) {
      console.error("Handlebars compilation error:", err);
      setCompiledHtml("<p class='text-red-500'>Error rendering preview</p>");
    }
  }, [template, data]);

  useEffect(() => {
    if (!iframeRef.current) return;
    const iframe = iframeRef.current;
    const handleLoad = () => {
      if (iframe.contentDocument?.body) {
        iframe.style.height = iframe.contentDocument.body.scrollHeight + "px";
      }
    };
    iframe.addEventListener("load", handleLoad);
    return () => iframe.removeEventListener("load", handleLoad);
  }, [compiledHtml]);

  return (
    <div className="h-full bg-white dark:bg-zinc-950 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden flex flex-col">
      <div className="p-2 bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
        <span className="text-xs font-medium text-zinc-500">Live Preview</span>
      </div>
      <div className="flex-1 overflow-auto">
        <iframe
          ref={iframeRef}
          srcDoc={compiledHtml}
          title="Resume Preview"
          className="w-full bg-white"
          sandbox="allow-scripts"
        />
      </div>
    </div>
  );
};

// ------------------------------------------------------------
// Zod schema generator (enhanced to handle nested fields and validation)
// ------------------------------------------------------------
const generateZodSchema = (sections: any[]): z.ZodObject<any> => {
  const shape: any = {};

  const processFields = (fields: any[]): z.ZodObject<any> => {
    const fieldShape: any = {};
    fields.forEach((field) => {
      let fieldSchema: any;

      // Base type
      switch (field.type) {
        case 'email':
          fieldSchema = z.string().email(field.validation?.message || "Invalid email").or(z.literal(''));
          break;
        case 'url':
          fieldSchema = z.string().url(field.validation?.message || "Invalid URL").or(z.literal(''));
          break;
        case 'number':
          fieldSchema = z.number().or(z.nan()).or(z.literal('')).transform((val) => (val === '' ? undefined : val));
          break;
        case 'checkbox':
          fieldSchema = z.boolean().default(false);
          break;
        case 'date':
          fieldSchema = z.string().optional();
          break;
        case 'group':
          fieldSchema = processFields(field.fields || []);
          if (field.multiple) {
            fieldSchema = z.array(fieldSchema);
          }
          break;
        case 'array':
          fieldSchema = z.array(processFields(field.fields || []));
          break;
        default:
          fieldSchema = z.string().optional().or(z.literal(''));
      }

      // Apply validation rules
      if (field.validation) {
        const v = field.validation;
        if (v.pattern) {
          fieldSchema = fieldSchema.refine((val: any) => new RegExp(v.pattern).test(val), {
            message: v.message || "Invalid format",
          });
        }
        if (v.minLength !== undefined && field.type !== 'number') {
          fieldSchema = fieldSchema.refine((val: any) => !val || val.length >= v.minLength, {
            message: v.message || `Minimum length is ${v.minLength}`,
          });
        }
        if (v.maxLength !== undefined && field.type !== 'number') {
          fieldSchema = fieldSchema.refine((val: any) => !val || val.length <= v.maxLength, {
            message: v.message || `Maximum length is ${v.maxLength}`,
          });
        }
        if (v.min !== undefined && field.type === 'number') {
          fieldSchema = fieldSchema.refine((val: any) => val === undefined || val >= v.min, {
            message: v.message || `Minimum value is ${v.min}`,
          });
        }
        if (v.max !== undefined && field.type === 'number') {
          fieldSchema = fieldSchema.refine((val: any) => val === undefined || val <= v.max, {
            message: v.message || `Maximum value is ${v.max}`,
          });
        }
      }

      // Required check
      if (field.required) {
        if (field.type === 'checkbox') {
          fieldSchema = fieldSchema.refine((val: any) => val === true, {
            message: field.validation?.message || "This field is required",
          });
        } else if (field.type === 'group' && field.multiple) {
          fieldSchema = fieldSchema.min(1, field.validation?.message || "At least one item required");
        } else {
          fieldSchema = fieldSchema.refine((val: any) => val && val.trim().length > 0, {
            message: field.validation?.message || `${field.label} is required`,
          });
        }
      }

      fieldShape[field.name] = fieldSchema;
    });
    return z.object(fieldShape);
  };

  sections.forEach((section) => {
    if (section.type === 'array') {
      shape[section.key] = z.array(processFields(section.fields));
      if (section.required) {
        shape[section.key] = shape[section.key].min(1, `${section.label} requires at least one entry`);
      }
    } else {
      shape[section.key] = processFields(section.fields);
    }
  });

  return z.object(shape);
};

// ------------------------------------------------------------
// Error helpers (unchanged)
// ------------------------------------------------------------
const countErrorsForSection = (errors: FieldErrors, sectionKey: string): { count: number; fields: string[] } => {
  const result = { count: 0, fields: [] as string[] };
  const secErr = (errors as any)[sectionKey];
  if (!secErr) return result;

  if (!Array.isArray(secErr)) {
    Object.keys(secErr).forEach((k) => {
      if ((secErr as any)[k]) {
        result.count += 1;
        result.fields.push(k);
      }
    });
    return result;
  }

  secErr.forEach((itemErr: any, idx: number) => {
    if (!itemErr) return;
    Object.keys(itemErr).forEach((k) => {
      if (itemErr[k]) {
        result.count += 1;
        result.fields.push(`${k} (item ${idx + 1})`);
      }
    });
  });
  return result;
};

// ------------------------------------------------------------
// Main Component
// ------------------------------------------------------------
export default function PremiumResumeBuilder({
  id,
  builderId,
}: {
  id: string;
  builderId: string;
}) {
  const router = useRouter();
  const headerRef = useRef<HTMLDivElement | null>(null);

  const [currentStep, setCurrentStep] = useState(0);
  const [showMobilePreview, setShowMobilePreview] = useState(false);
  const [reviewMode, setReviewMode] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [sectionValidationMap, setSectionValidationMap] = useState<
    Record<string, { valid: boolean; count: number; fields: string[] }>
  >({});

  // Fetch template
  const { data: apiResponse, isFetching } = useApiQuery(
    ["templates", id],
    `/template/templateDetails/${id}`,
    "axios"
  );
  const template:any = apiResponse?.data;

  const sections = useMemo(
    () => [...(template?.sections || [])].sort((a, b) => a.order - b.order),
    [template]
  );
  const dynamicSchema = useMemo(() => generateZodSchema(sections), [sections]);

  const methods = useForm({
    resolver: zodResolver(dynamicSchema),
    mode: "onChange",
    defaultValues: template?.resumeData || {},
  });

  const { watch, handleSubmit, trigger, reset, formState } = methods;
  const formData = watch();

  // Initialize form with template.resumeData
  useEffect(() => {
    if (template?.resumeData) {
      reset(template.resumeData);
      setLastSaved(new Date());
    }
  }, [template, reset]);

  // ------------------------------------------------------------
  // Auto-save logic (debounced 2 seconds, deep compare)
  // ------------------------------------------------------------
  const prevDataRef = useRef<any>(null);
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const performAutoSave = useCallback(async (data: any) => {
    setIsAutoSaving(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    // In a real app, you would send data to the server here
    setLastSaved(new Date());
    setIsAutoSaving(false);
    toast.success("Progress auto-saved", { id: "auto-save" });
  }, []);

  useEffect(() => {
    if (!prevDataRef.current) {
      prevDataRef.current = formData;
      return;
    }

    if (!deepEqual(prevDataRef.current, formData)) {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
      autoSaveTimeoutRef.current = setTimeout(() => {
        performAutoSave(formData);
        prevDataRef.current = formData;
      }, 2000);
    }

    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, [formData, performAutoSave]);

  // ------------------------------------------------------------
  // Progress percentage
  // ------------------------------------------------------------
  const progressPercent = useMemo(() => {
    if (!sections.length) return 0;
    const filled = sections.reduce((acc, sec) => {
      const secValues = (formData as any)[sec.key];
      if (!secValues) return acc;
      if (Array.isArray(secValues)) {
        const hasAny = secValues.some((it: any) =>
          Object.values(it || {}).some((v) => v !== undefined && v !== "" && v !== null)
        );
        return acc + (hasAny ? 1 : 0);
      } else {
        const hasAny = Object.values(secValues || {}).some(
          (v) => v !== undefined && v !== "" && v !== null
        );
        return acc + (hasAny ? 1 : 0);
      }
    }, 0);
    return Math.round((filled / sections.length) * 100);
  }, [formData, sections]);

  // ------------------------------------------------------------
  // Validate all sections for review mode
  // ------------------------------------------------------------
  const validateAllSections = async () => {
    const map: Record<string, { valid: boolean; count: number; fields: string[] }> = {};
    for (const sec of sections) {
      const isValid = await trigger(sec.key as any);
      const errorsSnapshot = methods.formState.errors;
      const { count, fields } = countErrorsForSection(errorsSnapshot, sec.key);
      map[sec.key] = { valid: isValid, count, fields };
    }
    setSectionValidationMap(map);
    return map;
  };

  useEffect(() => {
    if (reviewMode) {
      validateAllSections();
      setShowMobilePreview(false);
    }
  }, [reviewMode]);

  // ------------------------------------------------------------
  // Save changes (manual submit)
  // ------------------------------------------------------------
  const onSubmit = async (data: any) => {
    setIsGenerating(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    toast.success("Resume saved successfully!");
    setLastSaved(new Date());
    setIsGenerating(false);
  };

  // ------------------------------------------------------------
  // Download as HTML file (with simulated delay)
  // ------------------------------------------------------------
  const handleDownload = async () => {
    if (!template?.htmlLayout) return;
    setIsDownloading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const compile = Handlebars.compile(template.htmlLayout);
      const htmlContent = compile(formData);

      const blob = new Blob([htmlContent], { type: "text/html" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${template.slug || "resume"}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success("Download started!");
    } catch (err) {
      toast.error("Failed to generate download");
    } finally {
      setIsDownloading(false);
    }
  };

  // ------------------------------------------------------------
  // Next step handler
  // ------------------------------------------------------------
  const nextStep = async () => {
    if (reviewMode) {
      setReviewMode(false);
      return;
    }
    const currentKey = sections[currentStep]?.key;
    const valid = await trigger(currentKey as any);
    if (!valid) {
      const errorsSnapshot = methods.formState.errors;
      const { count } = countErrorsForSection(errorsSnapshot, currentKey);
      setSectionValidationMap((prev) => ({
        ...prev,
        [currentKey]: { valid, count, fields: [] },
      }));
      const container = document.querySelector("#form-scroll-container");
      (container as HTMLElement | null)?.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    if (currentStep < sections.length - 1) setCurrentStep((s) => s + 1);
    else setReviewMode(true);
  };

  if (isFetching || !template) return <SkeletonBuilder />;

  const activeSection = sections[currentStep];

  return (
    <div className="bg-zinc-50 dark:bg-zinc-950 flex flex-col h-screen overflow-hidden">
      {/* Header */}
      <div
        ref={headerRef}
        className="h-16 border-b px-4 sm:px-6 flex items-center justify-between bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl z-50"
      >
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="rounded-full"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-sm font-semibold tracking-tight">{template.name}</h1>
            <p className="text-xs text-zinc-400 mt-0.5">SaaS Resume Builder</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Mobile preview toggle */}
          <Button
            variant="outline"
            size="sm"
            className="rounded-full lg:hidden"
            onClick={() => setShowMobilePreview((s) => !s)}
          >
            {showMobilePreview ? "Hide" : "Preview"}
          </Button>

          {/* Auto-save indicator */}
          <div className="flex items-center gap-2 text-xs text-zinc-500">
            {isAutoSaving ? (
              <>
                <Loader2 className="h-3 w-3 animate-spin" />
                <span>Saving...</span>
              </>
            ) : lastSaved ? (
              <>
                <Cloud className="h-3 w-3" />
                <span className="hidden sm:inline">Saved {format(lastSaved, "HH:mm")}</span>
              </>
            ) : (
              <CloudOff className="h-3 w-3" />
            )}
          </div>

          {/* Download button */}
          <Button
            size="sm"
            variant="outline"
            onClick={handleDownload}
            disabled={isDownloading}
            className="rounded-full"
          >
            {isDownloading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            <span className="ml-2 hidden sm:inline">Download</span>
          </Button>
        </div>
      </div>

      {/* Sticky progress + step navigation */}
      <div className="sticky top-16 z-40 bg-white/60 dark:bg-zinc-950/60 backdrop-blur-md border-b border-transparent">
        <div className="px-4 sm:px-6">
          <div className="h-1 w-full bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 transition-all"
              style={{ width: `${progressPercent}%` }}
              aria-hidden
            />
          </div>
        </div>

        <nav className="flex gap-2 px-4 sm:px-6 py-3 overflow-x-auto no-scrollbar">
          {sections.map((sec, idx) => {
            const isActive = idx === currentStep && !reviewMode;
            return (
              <button
                key={sec.key}
                onClick={() => {
                  setCurrentStep(idx);
                  setReviewMode(false);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className={`flex items-center gap-2 px-3 py-2 rounded-full text-[12px] font-semibold shrink-0 transition-all ${
                  isActive
                    ? "bg-zinc-900 text-white dark:bg-white dark:text-black shadow"
                    : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 bg-transparent"
                }`}
              >
                <span className="opacity-60">0{idx + 1}</span>
                <span className="max-w-[140px] truncate">{sec.label}</span>
              </button>
            );
          })}

          <button
            onClick={() => setReviewMode(true)}
            className={`flex items-center gap-2 px-3 py-2 rounded-full text-[12px] font-semibold shrink-0 transition-all ${
              reviewMode
                ? "bg-emerald-600 text-white shadow"
                : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
            }`}
          >
            <span>Review</span>
          </button>
        </nav>
      </div>

      {/* Main Grid */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-2 overflow-hidden">
        {/* Left: form area */}
        <section
          className={`flex flex-col bg-white dark:bg-zinc-950 border-r border-zinc-200 dark:border-zinc-800 overflow-hidden ${
            showMobilePreview ? "hidden lg:flex" : "flex"
          }`}
        >
          <div
            id="form-scroll-container"
            className="flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-6 lg:p-8"
          >
            <div className="w-full max-w-4xl mx-auto">
              <header className="mb-6">
                <h2 className="text-2xl font-semibold text-zinc-900 dark:text-white">
                  {reviewMode ? "Review & Validate" : activeSection.label}
                </h2>
                <p className="text-zinc-500 text-sm mt-2">
                  {reviewMode
                    ? "Validate each section — missing fields will be highlighted. Click a section to jump and fix."
                    : "Complete this section to update your resume in real-time."}
                </p>
              </header>

              <FormProvider {...methods}>
                <form className="space-y-6">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={reviewMode ? "review" : activeSection.key}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.12 }}
                    >
                      {reviewMode ? (
                        <div className="space-y-4">
                          {sections.map((sec, idx) => {
                            const mapEntry = sectionValidationMap[sec.key];
                            const count = mapEntry?.count ?? 0;
                            const valid = mapEntry?.valid ?? false;
                            const fields = mapEntry?.fields ?? [];
                            return (
                              <div
                                key={sec.key}
                                className="p-4 sm:p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                              >
                                <div className="flex-1">
                                  <button
                                    onClick={() => {
                                      setCurrentStep(idx);
                                      setReviewMode(false);
                                      window.scrollTo({ top: 0, behavior: "smooth" });
                                    }}
                                    className="text-left w-full"
                                  >
                                    <div className="flex items-center gap-3">
                                      <div
                                        className={`h-9 w-9 rounded-full flex items-center justify-center ${
                                          valid
                                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                                            : "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                                        }`}
                                      >
                                        {valid ? (
                                          <Check className="h-4 w-4" />
                                        ) : (
                                          <AlertCircle className="h-4 w-4" />
                                        )}
                                      </div>
                                      <div className="text-left">
                                        <div className="font-semibold text-zinc-900 dark:text-white">
                                          {sec.label}
                                        </div>
                                        <div className="text-xs text-zinc-500">
                                          {valid
                                            ? "All fields valid"
                                            : `${count} missing / invalid field(s)`}
                                        </div>
                                      </div>
                                    </div>
                                  </button>
                                </div>

                                {!valid && fields.length > 0 && (
                                  <div className="mt-3 sm:mt-0 text-sm text-destructive">
                                    <div className="font-medium mb-1">
                                      Missing / invalid:
                                    </div>
                                    <ul className="list-disc ml-4">
                                      {fields.map((f, i) => (
                                        <li key={i} className="truncate max-w-[220px]">
                                          {f}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <SectionRenderer section={activeSection} />
                      )}
                    </motion.div>
                  </AnimatePresence>
                </form>
              </FormProvider>
            </div>
          </div>

          {/* Footer controls */}
          <div className="sticky bottom-0 z-50 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-t border-zinc-200 dark:border-zinc-800">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-3 justify-between">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  disabled={currentStep === 0 && !reviewMode}
                  onClick={() =>
                    reviewMode
                      ? setReviewMode(false)
                      : setCurrentStep((s) => Math.max(0, s - 1))
                  }
                  className="rounded-xl"
                >
                  <ChevronLeft className="h-5 w-5 mr-1" /> Back
                </Button>
              </div>

              <div className="flex-1 px-4">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1 items-center">
                    {sections.map((_, i) => (
                      <div
                        key={i}
                        className={`h-1 rounded-full transition-all duration-300 ${
                          i === currentStep && !reviewMode
                            ? "w-8 bg-blue-500"
                            : "w-2 bg-zinc-300 dark:bg-zinc-700"
                        }`}
                      />
                    ))}
                    <div
                      className={`h-1 rounded-full transition-all duration-300 ${
                        reviewMode ? "w-8 bg-emerald-500" : "w-2 bg-zinc-300 dark:bg-zinc-700"
                      }`}
                    />
                  </div>

                  <div className="ml-3 text-xs text-zinc-500">
                    Progress: {progressPercent}%
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {reviewMode ? (
                  <Button
                    onClick={handleSubmit(onSubmit)}
                    disabled={isGenerating}
                    className="bg-blue-600 text-white hover:bg-blue-700 rounded-xl px-4 sm:px-5 font-medium"
                  >
                    {isGenerating ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4 mr-2" />
                    )}
                    Save Changes
                  </Button>
                ) : (
                  <Button
                    onClick={nextStep}
                    className="bg-zinc-900 text-white dark:bg-white dark:text-black rounded-xl px-4 sm:px-5 font-medium"
                  >
                    Next <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Right: Preview */}
        <section
          className={`${
            showMobilePreview ? "flex" : "hidden"
          } lg:flex flex-col bg-zinc-50 dark:bg-zinc-950 overflow-hidden p-4 lg:p-6`}
        >
          <ResumePreview template={template} data={formData} />
        </section>
      </main>
    </div>
  );
}