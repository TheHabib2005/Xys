export type FieldType =
  | "text"
  | "email"
  | "url"
  | "date"
  | "select"
  | "textarea"
  | "richtext"
  | "checkbox";

export interface FieldUI {
  placeholder?: string;
  description?: string;
  grid?: string;
}

export interface FieldOption {
  label?: string;
  value: string;
}

export interface BuilderField {
  name: string;
  type: FieldType;
  label?: string;
  required?: boolean;
  options?: string[];
  ui?: FieldUI;
}

export interface BuilderSection {
  key: string;
  label: string;
  type: "object" | "array";
  order: number;
  fields: BuilderField[];
  minItems?: number;
  ui?: {
    addButtonText?: string;
    itemTitle?: string;
  };
}

export interface ResumeTemplate {
  id: string;
  name: string;
  sections: BuilderSection[];
  htmlLayout: string;
  resumeData?: any;
}