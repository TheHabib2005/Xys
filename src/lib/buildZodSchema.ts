import { z, ZodTypeAny } from 'zod';
import type { SectionDef, FieldDef } from './templates';

function buildFieldSchema(field: FieldDef): ZodTypeAny {
  if (field.type === 'checkbox') {
    return z.boolean().default(field.default === true);
  }

  let schema: ZodTypeAny;

  switch (field.type) {
    case 'email':
      schema = field.required
        ? z.string().min(1, 'Email is required').email('Invalid email')
        : z.string().email('Invalid email').or(z.literal(''));
      break;
    case 'url':
      schema = field.required
        ? z.string().min(1, 'URL is required').url('Invalid URL')
        : z.string().url('Invalid URL').or(z.literal(''));
      break;
    default:
      if (field.required) {
        const msg = field.validation?.message || `${field.label} is required`;
        schema = z.string().min(field.validation?.min || 1, msg);
      } else {
        schema = z.string();
      }
  }

  if (field.validation?.max) {
    schema = (schema as z.ZodString).max(field.validation.max, `Max ${field.validation.max} characters`);
  }

  return schema;
}

function buildObjectSchema(fields: FieldDef[]): z.ZodObject<Record<string, ZodTypeAny>> {
  const shape: Record<string, ZodTypeAny> = {};
  for (const field of fields) {
    shape[field.name] = buildFieldSchema(field);
  }
  return z.object(shape);
}

export function buildZodSchema(sections: SectionDef[]): z.ZodObject<Record<string, ZodTypeAny>> {
  const shape: Record<string, ZodTypeAny> = {};

  for (const section of sections) {
    const objSchema = buildObjectSchema(section.fields);
    shape[section.id] = section.type === 'array' ? z.array(objSchema) : objSchema;
  }

  return z.object(shape);
}

export function buildSectionSchema(section: SectionDef): ZodTypeAny {
  const objSchema = buildObjectSchema(section.fields);
  return section.type === 'array' ? z.array(objSchema).min(0) : objSchema;
}
