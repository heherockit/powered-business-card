import React from 'react';
import { useTranslation } from 'react-i18next';

export function LanguageSelect() {
  const { i18n, t } = useTranslation();
  const value = i18n.language || 'en';

  return (
    <label className="hidden md:flex items-center gap-2">
      <span className="sr-only">{t('header.language')}</span>
      <select
        aria-label={t('header.language')}
        value={value}
        onChange={(e) => i18n.changeLanguage(e.target.value)}
        className="select-flag focus-ring"
      >
        <option value="en" title="English">
          🇺🇸
        </option>
        <option value="es" title="Español">
          🇪🇸
        </option>
        <option value="zh" title="中文">
          🇨🇳
        </option>
      </select>
    </label>
  );
}
