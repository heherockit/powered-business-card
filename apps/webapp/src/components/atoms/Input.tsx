import React from 'react';

export const TextInput = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className = '', ...props }, ref) => {
  return <input {...props} ref={ref} className={`input focus-ring ${className}`} />;
});
TextInput.displayName = 'TextInput';

export const TextArea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className = '', ...props }, ref) => {
  return (
    <textarea
      {...props}
      ref={ref}
      className={`input focus-ring overflow-hidden resize-none transition-[height] duration-200 ease-in-out ${className}`}
    />
  );
});
TextArea.displayName = 'TextArea';
