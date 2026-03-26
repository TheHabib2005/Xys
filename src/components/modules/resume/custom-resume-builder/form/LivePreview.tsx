import React, { useMemo } from 'react';

interface LivePreviewProps {
  htmlLayout: string;
  data: Record<string, unknown>;
}

/**
 * Simple Handlebars-like template renderer.
 * Supports: {{var}}, {{{raw}}}, {{#if}}, {{#each}}, {{this.prop}}
 */
function renderTemplate(template: string, data: Record<string, unknown>): string {
  let html = template;

  // {{#each section}}...{{/each}}
  html = html.replace(/\{\{#each\s+(\w+)\}\}([\s\S]*?)\{\{\/each\}\}/g, (_, key, inner) => {
    const arr = data[key];
    if (!Array.isArray(arr) || arr.length === 0) return '';
    return arr.map((item: Record<string, unknown>) => {
      let itemHtml = inner;
      // {{this.prop}} or {{{this.prop}}}
      itemHtml = itemHtml.replace(/\{\{\{this\.(\w+)\}\}\}/g, (_: string, p: string) => String(item[p] ?? ''));
      itemHtml = itemHtml.replace(/\{\{this\.(\w+)\}\}/g, (_: string, p: string) => escapeHtml(String(item[p] ?? '')));
      return itemHtml;
    }).join('');
  });

  // {{#if section.field}}...{{/if}} and {{#if section.length}}
  html = html.replace(/\{\{#if\s+([\w.]+)\}\}([\s\S]*?)\{\{\/if\}\}/g, (_, path, inner) => {
    const val = resolvePath(data, path);
    if (!val || (Array.isArray(val) && val.length === 0)) return '';
    return inner;
  });

  // {{{section.field}}} (raw HTML)
  html = html.replace(/\{\{\{([\w.]+)\}\}\}/g, (_, path) => String(resolvePath(data, path) ?? ''));

  // {{section.field}} (escaped)
  html = html.replace(/\{\{([\w.]+)\}\}/g, (_, path) => escapeHtml(String(resolvePath(data, path) ?? '')));

  return html;
}

function resolvePath(obj: Record<string, unknown>, path: string): unknown {
  return path.split('.').reduce<unknown>((acc, key) => {
    if (acc && typeof acc === 'object') return (acc as Record<string, unknown>)[key];
    return undefined;
  }, obj);
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export const LivePreview: React.FC<LivePreviewProps> = ({ htmlLayout, data }) => {
  const html = useMemo(() => renderTemplate(htmlLayout, data), [htmlLayout, data]);

  return (
    <div className="w-full h-full overflow-auto bg-canvas-paper rounded-lg shadow-sm border border-border">
      <div
        className="resume-preview"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
};
