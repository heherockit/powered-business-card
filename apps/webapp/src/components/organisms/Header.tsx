import { BRAND_NAME } from '../../constants/brand';
import logo from '../../assets/pbc_logo_cropped.png';
import { LanguageSelect } from '../atoms/LanguageSelect';
import { Button } from '../atoms/Button';
import { useTranslation } from 'react-i18next';

export function Header() {
  const { t } = useTranslation();
  return (
    <header className="sticky top-0 z-20 bg-white backdrop-blur border-b border-border text-center">
      <a href="#main" className="skip-link">Skip to content</a>
      <div className="mx-auto max-w-7xl px-6 grid grid-cols-3 items-center">
        <div className="flex items-center gap-3 justify-self-start">
          <img
            src={logo}
            alt="Cardify logo"
            loading="lazy"
            decoding="async"
            width={80}
            height={80}
            className="w-20 h-20 rounded-md object-contain border-0"
          />
          <span className="hidden md:inline font-semibold tracking-wide text-textPrimary">{BRAND_NAME}</span>
        </div>
        <nav aria-label="Main navigation" className="hidden md:flex items-center justify-self-center gap-4">
          <a href="/" className="text-gray-600 px-3 py-2 rounded-md transition hover:text-gray-900 hover:bg-gray-100 focus-ring">{t('nav.home')}</a>
          <a href="/templates" className="text-gray-600 px-3 py-2 rounded-md transition hover:text-gray-900 hover:bg-gray-100 focus-ring">{t('nav.templates')}</a>
          <a href="/docs" className="text-gray-600 px-3 py-2 rounded-md transition hover:text-gray-900 hover:bg-gray-100 focus-ring">{t('nav.docs')}</a>
        </nav>
        <div className="flex items-center gap-4 justify-self-end transition-all duration-300">
          <label
          htmlFor="nav-toggle"
          role="button"
          aria-label="Toggle navigation"
          aria-controls="primary-nav"
          className="md:!hidden btn btn-ghost h-10 focus-ring transition hover:bg-gray-100 active:scale-95"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </label>
          <LanguageSelect />
          <Button type="button" aria-label={t('header.user')} className="inline-flex btn-ghost h-10 transition">
            {/* User icon */}
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </Button>
        </div>
      </div>
      {/* Hidden checkbox controls mobile menu visibility via CSS (peer-checked) */}
      <input
        type="checkbox"
        id="nav-toggle"
        className="peer sr-only"
        aria-label="Toggle navigation"
        aria-controls="primary-nav"
      />
      <div
        id="primary-nav"
        className="hidden md:hidden peer-checked:block md:peer-checked:hidden border-t border-border bg-white text-center overflow-hidden transition-[max-height,opacity] duration-300 ease-in-out max-h-0 opacity-0 peer-checked:max-h-64 peer-checked:opacity-100"
      >
        <div className="mx-auto max-w-7xl px-6 py-3 flex flex-col items-center gap-2">
          <a href="/" className="text-gray-700 px-3 py-2 rounded-md hover:bg-gray-100 focus-ring">{t('nav.home')}</a>
          <a href="/templates" className="text-gray-700 px-3 py-2 rounded-md hover:bg-gray-100 focus-ring">{t('nav.templates')}</a>
          <a href="/docs" className="text-gray-700 px-3 py-2 rounded-md hover:bg-gray-100 focus-ring">{t('nav.docs')}</a>
        </div>
      </div>
    </header>
  );
}