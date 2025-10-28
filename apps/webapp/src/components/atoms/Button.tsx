import React from 'react';

export const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({
  className = '',
  ...props
}) => {
  const base = ['btn', 'focus-ring'].join(' ');
  return <button {...props} className={`${base} ${className}`} />;
};
