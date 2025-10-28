import React from 'react';

export interface BusinessCardPreviewProps {
  title?: string;
  subtitle?: string;
  content?: string;
}

export function BusinessCardPreview({
  title = 'Your Name',
  subtitle = 'Role / Company',
  content = 'Card content preview',
}: BusinessCardPreviewProps) {
  return (
    <div className="card grid gap-2 p-4" aria-label="business-card-preview">
      <h3 className="m-0 text-lg">{title}</h3>
      <p className="m-0 text-textSecondary">{subtitle}</p>
      <p className="m-0">{content}</p>
    </div>
  );
}
