import logo from '../../assets/pbc_logo_cropped.png';

/*
  Footer
  - Semantic HTML5 <footer> with role="contentinfo" and accessible nav groups.
  - Responsive 6-column grid:
    - Column 1: Company logo
    - Columns 2–6: Link groups (Company, Product, Resources, Legal, Community)
  - Consistent styling using Tailwind utility classes and site design tokens.
  - WCAG-friendly focus states and hover effects for interactive elements.
*/

export function Footer() {
  const year = new Date().getFullYear();

  const columns: Array<{ id: string; title: string; links: Array<{ label: string; href: string }> }> = [
    {
      id: 'company',
      title: 'Company',
      links: [
        { label: 'About Us', href: '#' },
        { label: 'Careers', href: '#' },
        { label: 'Contact', href: '#' },
      ],
    },
    {
      id: 'product',
      title: 'Product',
      links: [
        { label: 'Features', href: '#' },
        { label: 'Pricing', href: '#' },
        { label: 'Integrations', href: '#' },
      ],
    },
    {
      id: 'resources',
      title: 'Resources',
      links: [
        { label: 'Documentation', href: '#' },
        { label: 'Blog', href: '#' },
        { label: 'Support', href: '#' },
      ],
    },
    {
      id: 'legal',
      title: 'Legal',
      links: [
        { label: 'Privacy Policy', href: '#' },
        { label: 'Terms of Service', href: '#' },
      ],
    },
    {
      id: 'community',
      title: 'Community',
      links: [
        { label: 'Forum', href: '#' },
        { label: 'Events', href: '#' },
        { label: 'Social Media', href: '#' },
      ],
    },
  ];

  return (
    <footer role="contentinfo" aria-label="Site footer" className="border-t border-border bg-white">
      {/* Container: aligns with site content width and spacing */}
      <div className="mx-auto max-w-7xl px-6 py-10">
        {/* Responsive 6-column grid: 2 cols on mobile, 3 on tablet, 6 on desktop */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-x-6 gap-y-8 items-stretch">
          {/* Column 1: Logo top-left */}
          <div className="flex flex-col items-start">
            <a href="/" aria-label="Homepage" className="self-start">
              <img
                src={logo}
                alt="Cardify logo"
                loading="lazy"
                decoding="async"
                width={64}
                height={64}
                className="w-16 h-16 rounded-md object-contain"
              />
            </a>
          </div>

          {/* Columns 2–6: Link groups with semantic nav and labels */}
          {columns.map((col) => (
            <nav key={col.id} aria-labelledby={`footer-${col.id}-label`} className="text-left">
              <h2 id={`footer-${col.id}-label`} className="m-0 text-sm font-semibold text-textPrimary">
                {col.title}
              </h2>
              <ul className="mt-3 space-y-2" aria-label={`${col.title} links`}>
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-textSecondary hover:text-textPrimary transition-colors focus-ring"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/* Footer base row: restore original centered copyright position */}
        <div className="mt-10 text-center text-sm text-textSecondary" aria-label="copyright">
          © {year} Cardify. All rights reserved.
        </div>
      </div>
    </footer>
  );
}