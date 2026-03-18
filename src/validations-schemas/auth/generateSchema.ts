import { BuilderSection } from "@/interfaces/builder";
import * as z from "zod";


export const generateZodSchema = (sections: BuilderSection[]) => {
  const shape: Record<string, any> = {};

  sections.forEach((section) => {
    const sectionShape: Record<string, any> = {};

    section.fields.forEach((field) => {
      let schema: any = z.string().optional().or(z.literal(""));

      if (field.type === "email") schema = z.string().email();
      if (field.type === "url") schema = z.string().url();

      if (field.required) {
        schema =
          field.type === "checkbox"
            ? z.boolean()
            : z.string().min(1, `${field.label} is required`);
      }

      sectionShape[field.name] = schema;
    });

    shape[section.key] =
      section.type === "array"
        ? z.array(z.object(sectionShape)).min(section.minItems || 0)
        : z.object(sectionShape);
  });

  return z.object(shape);
};