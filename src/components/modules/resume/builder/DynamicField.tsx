"use client";

import { BuilderField } from "@/interfaces/builder";
import { useFormContext } from "react-hook-form";

export const DynamicField = ({
  field,
  name
}: {
  field: BuilderField;
  name: string;
}) => {
  const { register, formState } = useFormContext();
  const error = name
    .split(".")
    .reduce((obj: any, key: string) => obj?.[key], formState.errors);

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{field.label}</label>

      <input
        {...register(name)}
        placeholder={field.ui?.placeholder}
        className={`border p-2 rounded w-full ${
          error ? "border-red-500" : ""
        }`}
      />

      {error && <p className="text-xs text-red-500">{error.message}</p>}
    </div>
  );
};