import type { SectionDef, FieldDef } from './templates';

function buildFieldDefault(field: FieldDef): string | boolean {
  if (field.type === 'checkbox') return field.default === true;
  return (field.default as string) ?? '';
}

function buildObjectDefaults(fields: FieldDef[]): Record<string, unknown> {
  const obj: Record<string, unknown> = {};
  for (const field of fields) {
    obj[field.name] = buildFieldDefault(field);
  }
  return obj;
}

export function buildDefaultValues(sections: SectionDef[]): Record<string, unknown> {
  const defaults: Record<string, unknown> = {};

  for (const section of sections) {
    if (section.type === 'array') {
      defaults[section.id] = [buildObjectDefaults(section.fields)];
    } else {
      defaults[section.id] = buildObjectDefaults(section.fields);
    }
  }

  return defaults;
}

export function buildEmptyItem(fields: FieldDef[]): Record<string, unknown> {
  return buildObjectDefaults(fields);
}
