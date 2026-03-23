import { z } from 'zod';
import { ResumeSchema } from '@/interfaces/templateEditor';

export function generateZodSchema(schema: ResumeSchema) {
  const schemaObject: any = {};

  schema.forEach((section) => {
    const sectionFields: any = {};
    
    section.fields.forEach((field) => {
      let fieldSchema: any;

      switch (field.type) {
        case 'email':
          fieldSchema = z.string().email({ message: "Invalid email address" });
          break;
        case 'url':
          fieldSchema = z.string().url({ message: "Invalid URL" }).or(z.string().length(0));
          break;
        case 'number':
          fieldSchema = z.coerce.number();
          break;
        case 'select':
          if (field.options && field.options.length > 0) {
            fieldSchema = z.enum(field.options as [string, ...string[]]);
          } else {
            fieldSchema = z.string();
          }
          break;
        default:
          fieldSchema = z.string();
      }

      if (field.validation) {
        if (field.validation.minLength) {
          fieldSchema = fieldSchema.min(field.validation.minLength, {
            message: field.validation.message || `Minimum ${field.validation.minLength} characters required`
          });
        }
        if (field.validation.maxLength) {
          fieldSchema = fieldSchema.max(field.validation.maxLength, {
            message: field.validation.message || `Maximum ${field.validation.maxLength} characters allowed`
          });
        }
      }

      if (!field.required) {
        fieldSchema = fieldSchema.optional().or(z.literal(''));
      } else {
        fieldSchema = fieldSchema.min(1, { message: `${field.label} is required` });
      }

      sectionFields[field.name] = fieldSchema;
    });

    if (section.type === 'array') {
      schemaObject[section.key] = z.array(z.object(sectionFields));
      if (section.required) {
        schemaObject[section.key] = schemaObject[section.key].min(1, { message: `At least one ${section.label} entry is required` });
      }
    } else {
      schemaObject[section.key] = z.object(sectionFields);
    }
  });

  return z.object(schemaObject);
}

export const defaultValuesFromSchema = (schema: ResumeSchema) => {
  const values: any = {};
  schema.forEach((section) => {
    if (section.type === 'array') {
      values[section.key] = [];
    } else {
      const obj: any = {};
      section.fields.forEach(f => obj[f.name] = '');
      values[section.key] = obj;
    }
  });
  return values;
};
