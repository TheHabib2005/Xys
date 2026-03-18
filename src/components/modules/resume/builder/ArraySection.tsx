"use client";

import { useFieldArray, useFormContext } from "react-hook-form";
import { BuilderField, BuilderSection } from "@/interfaces/builder";

import { DynamicField } from "./DynamicField";

export const ArraySection = ({ section }: { section: BuilderSection }) => {
  const { control } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: section.key
  });

  return (
    <div className="space-y-4">
      {fields.map((item, index) => (
        <div key={item.id} className="border p-4 rounded">
          {section.fields.map((field) => (
            <DynamicField
              key={field.name}
              field={field}
              name={`${section.key}.${index}.${field.name}`}
            />
          ))}

          <button onClick={() => remove(index)}>Remove</button>
        </div>
      ))}

      <button onClick={() => append({})}>
        {section.ui?.addButtonText || "Add"}
      </button>
    </div>
  );
};