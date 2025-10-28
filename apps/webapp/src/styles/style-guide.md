# Style Guide

This document outlines the design system and implementation details for the web app. It ensures consistency, accessibility, and maintainability across the codebase.

## Theme
- Light theme palette:
  - Background: `#ffffff`
  - Surface: `#f8fafc`
  - Text (primary): `#1f2937`
  - Text (secondary): `#64748b`
  - Accent: `#2563eb`
  - Accent (alt): `#0ea5e9`
  - Success: `#16a34a`
  - Highlight: `#f59e0b`
  - Border: `#e5e7eb`

### Rationale
- Colors selected for WCAG 2.1 AA contrast on light backgrounds.
- Accent colors provide strong focus states and clear CTA prominence.

## Typography
- Font family: System UI sans stack (see `tailwind.config.js`).
- Base line-height: `1.6` for readability and scannability.
- Headings use semantic `<h1>`–`<h3>` with font weights `600–700`.

## Spacing & Grid
- Container: `max-w-7xl` with responsive padding (`px-6` / `py-8`).
- Vertical rhythm: `.baseline-flow` applies consistent spacing between stacked elements.
- Grid: responsive columns via Tailwind (`sm`, `md`, `lg`) breakpoints.

## Components
- Buttons: `.btn`, `.btn-primary`, `.btn-ghost` use subtle shadows and accessible focus rings.
- Inputs: `.input` with `focus-ring` ensures clear `:focus-visible` feedback.
- Cards: `.card` for consistent surface and border treatment.

## Header Layout & i18n
- Layout: three-column grid (`grid grid-cols-3 items-center`) with left brand (`justify-self-start`), centered nav (`hidden md:flex justify-self-center`), and right actions (`justify-self-end`).
- Mobile: hamburger toggle is a `label` tied to a hidden checkbox (`peer sr-only`) and hidden on `md+` with `md:!hidden`. Mobile menu uses `hidden md:hidden peer-checked:block` and animates via `transition-[max-height,opacity]`.
- Desktop: nav is `hidden md:flex`; right actions include language selector and user button (`hidden md:flex`).
- i18n: initialized in `src/i18n.ts` with `react-i18next`. Nav labels use `t('nav.*')`. The language selector updates `i18n.changeLanguage` and sets `document.documentElement.lang` on changes.
- Breakpoints: `md = 768px`, `lg = 1024px` (see Tailwind `screens`).

## Accessibility
- Target contrast ratio ≥ 4.5:1 for body text.
- Use `focus-ring` for keyboard navigability across controls.
- Provide `alt` text for images and `aria-*` on interactive controls (e.g., nav toggle).

## Performance
- Lazy-load images (`loading="lazy"`) and enable async decoding (`decoding="async"`).
- Keep shadows and transitions subtle to minimize paint costs.

## Implementation Notes
- Tailwind config defines the light theme palette and breakpoints.
- Global SCSS (`theme.scss`, `components.scss`) centralizes variables and reusable classes with `@apply`.
- Use utility classes for layout/spacing; use reusable classes for components and focus behavior.

## Prompt Component
- Width scaling: visually reduced to ~66.67% using responsive width classes (`w-full sm:w-11/12 md:w-2/3`) with `mx-auto` centering. Avoid transform scaling to keep font sizes normal.
- Spacing: container uses `px-6 py-4`; vertical spacing reduced by ~30–40% via `space-y-2.5 sm:space-y-3 md:space-y-3.5`. Action row uses `flex justify-between gap-2` to preserve ≥8px touch targets.
- Textarea: auto-resizes with JS (`onInput` + ref) and CSS `overflow-hidden`, `resize-none`, `transition-[height]`. Constraints: `min-height: 88px`, `max-height: 240px` to prevent scrollbars while maintaining usability.
- Layout: buttons and textarea managed with flexbox/grid utilities; upload button (plus icon) on the left; generate button (up-arrow icon) right-aligned.
- Accessibility: textarea labeled with `aria-label="Description"`, buttons include `aria-label`s, and `focus-ring` for keyboard navigation (WCAG 2.1 AA contrast maintained by theme colors).
- Cross-browser: verified in Chromium-based dev server; recommended checks in Safari and Firefox to confirm height transitions and focus styles behave consistently.

### QA Checklist
- Renders correctly from mobile → desktop breakpoints (`sm`, `md`, `lg`).
- Test textarea with short/medium/long text; confirm smooth height changes without scrollbars.
- No layout shifts when typing or clicking buttons; action row stays aligned.
- Keyboard navigation order remains logical: Upload → Textarea → Generate; focus is visible.
- Contrast ratios meet WCAG AA for text and interactive controls based on the light theme palette.