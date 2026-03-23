export interface FieldUI {
  grid?: string;
  columns?: number;
  description?: string;
  rows?: number;
  showCount?: boolean;
}

export interface Validation {
  message?: string;
  maxLength?: number;
  minLength?: number;
}

export interface Field {
  name: string;
  type: 'text' | 'email' | 'tel' | 'url' | 'textarea' | 'date' | 'number' | 'select';
  label: string;
  required?: boolean;
  placeholder?: string;
  options?: string[]; // For select type
  ui?: FieldUI;
  validation?: Validation;
}

export interface Section {
  key: string;
  type: 'object' | 'array';
  label: string;
  order: number;
  fields: Field[];
  ui?: FieldUI;
  required?: boolean;
}

export type ResumeSchema = Section[];

// Helper to generate mock data based on schema
export const generateMockData = (schema: ResumeSchema) => {
  const data: any = {};
  schema.forEach(section => {
    const generateFields = () => {
      const fields: any = {};
      section.fields.forEach(field => {
        switch (field.type) {
          case 'email': fields[field.name] = 'john@example.com'; break;
          case 'tel': fields[field.name] = '+1 234 567 890'; break;
          case 'url': fields[field.name] = 'https://example.com'; break;
          case 'date': fields[field.name] = '2023-01-01'; break;
          case 'number': fields[field.name] = 2024; break;
          case 'select': fields[field.name] = field.options?.[0] || 'Selected Option'; break;
          case 'textarea': fields[field.name] = field.placeholder || 'Sample long text content for this field...'; break;
          default: fields[field.name] = field.placeholder || 'Sample Text';
        }
      });
      return fields;
    };

    if (section.type === 'array') {
      data[section.key] = [generateFields(), generateFields()];
    } else {
      data[section.key] = generateFields();
    }
  });
  return data;
};
