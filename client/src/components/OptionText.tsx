import React from 'react';

// Split explicit address fields, not arbitrary prose, commands, JSON or decimal values.
const addressField = '(?:(?:MAC|IP(?:v[46])?)(?:\\s+de)?\\s+(?:origen|destino|source|destination)|(?:source|destination)\\s+(?:MAC|IP(?:v[46])?)(?:\\s+address)?)';
const startsWithField = new RegExp(`^${addressField}\\s*:`, 'i');
const fieldSeparator = new RegExp(`[,;]\\s*(?=${addressField}\\s*:)`, 'i');

export function optionListItems(text: string): string[] | null {
  const lines = text.trim().split(/\r?\n/).filter(line => line.trim());
  if (lines.length > 1 && lines.every(line => /^\s*[-•]\s+/.test(line))) {
    return lines.map(line => line.replace(/^\s*[-•]\s+/, ''));
  }
  const fields = text.trim().split(fieldSeparator);
  return fields.length > 1 && fields.every(field => startsWithField.test(field)) ? fields : null;
}

export const OptionText: React.FC<{ text: string }> = ({ text }) => {
  const items = optionListItems(text);
  if (!items) return <span className="block whitespace-pre-wrap break-words">{text}</span>;
  return (
    <span role="list" className="block space-y-1">
      {items.map((item, index) => (
        <span role="listitem" className="flex min-w-0 items-start gap-2" key={index}>
          <span aria-hidden="true" className="shrink-0">-</span>
          <span className="min-w-0 whitespace-pre-wrap break-words">{item}</span>
        </span>
      ))}
    </span>
  );
};
