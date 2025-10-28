import { useEffect, useRef, useState } from 'react';
import { TextArea } from '../atoms/Input';
import { Button } from '../atoms/Button';

export function Prompt() {
  const [content, setContent] = useState('Describe the card details, brand, role, and accents...');
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const taRef = useRef<HTMLTextAreaElement | null>(null);

  const minHeight = 88; // px
  const maxHeight = 240; // px

  useEffect(() => {
    const el = taRef.current;
    if (!el) return;
    el.style.height = '0px';
    const next = Math.max(minHeight, Math.min(maxHeight, el.scrollHeight));
    el.style.height = `${next}px`;
  }, [content]);

  const adjustHeight = () => {
    const el = taRef.current;
    if (!el) return;
    el.style.height = '0px';
    const next = Math.max(minHeight, Math.min(maxHeight, el.scrollHeight));
    el.style.height = `${next}px`;
  };

  return (
    <section className="card px-6 py-4 w-full sm:w-11/12 md:w-2/3 mx-auto space-y-2.5 sm:space-y-3 md:space-y-3.5">
      <div className="baseline-flow">
        <TextArea
          ref={taRef}
          aria-label="Description"
          id="prompt-content"
          value={content}
          onInput={adjustHeight}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Describe the information for your business card..."
          className="min-h-[88px] max-h-[240px]"
        />
      </div>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center">
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" />
          <Button
            type="button"
            aria-label="Upload image"
            onClick={() => fileInputRef.current?.click()}
          >
            {/* Plus icon */}
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </Button>
        </div>
        <Button type="button" aria-label="Generate">
          {/* Up arrow icon */}
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 19V5" />
            <path d="M5 12l7-7 7 7" />
          </svg>
        </Button>
      </div>
    </section>
  );
}