
import { BuilderSection } from "@/interfaces/builder";
import { ArraySection } from "./ArraySection";
import { DynamicField } from "./DynamicField";

export const SectionRenderer = ({ section }: { section: BuilderSection }) => {
  if (section.type === "array") {
    return <ArraySection section={section} />;
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      {section.fields.map((field) => (
        <DynamicField
          key={field.name}
          field={field}
          name={`${section.key}.${field.name}`}
        />
      ))}
    </div>
  );
};