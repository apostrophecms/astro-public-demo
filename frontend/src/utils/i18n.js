/**
 * Minimal frontend translation helper.
 *
 * Astro runs as its own server process, separate from ApostropheCMS, so
 * frontend components have no access to the backend's req.t()/__t(). This
 * small dictionary covers the handful of strings the site chrome (header,
 * footer, article templates, GitHub PR widget) renders directly, so
 * switching locale doesn't leave a mix of languages on the page.
 *
 * The backend remains the source of truth for content and for the CMS-side
 * `project:` translation namespace (backend/modules/@apostrophecms/i18n/i18n/project/).
 * Keep the locale prefixes below in step with
 * backend/modules/@apostrophecms/i18n/index.js `options.locales`.
 */

import { getBase } from './url.js';

const LOCALE_PREFIXES = {
  '/fr': 'fr',
  '/de': 'de'
};

const translations = {
  en: {
    writtenBy: 'Written by',
    allArticles: 'All Articles',
    menu: 'Menu',
    closeMenu: 'Close',
    toggleDarkMode: 'Toggle dark mode',
    footerExplore: 'Explore ApostropheCMS',
    footerProduct: 'Product',
    footerSocialMedia: 'Social Media',
    open: 'Open',
    closed: 'Closed',
    ghPrsForRepo: '{{state}} PRs for {{repo}}'
  },
  fr: {
    writtenBy: 'Écrit par',
    allArticles: 'Tous les articles',
    menu: 'Menu',
    closeMenu: 'Fermer',
    toggleDarkMode: 'Basculer le mode sombre',
    footerExplore: 'Découvrir ApostropheCMS',
    footerProduct: 'Produit',
    footerSocialMedia: 'Réseaux sociaux',
    open: 'Ouvert',
    closed: 'Fermé',
    ghPrsForRepo: 'PRs {{state}} pour {{repo}}'
  },
  de: {
    writtenBy: 'Verfasst von',
    allArticles: 'Alle Artikel',
    menu: 'Menü',
    closeMenu: 'Schließen',
    toggleDarkMode: 'Dunkelmodus umschalten',
    footerExplore: 'ApostropheCMS entdecken',
    footerProduct: 'Produkt',
    footerSocialMedia: 'Soziale Medien',
    open: 'Offen',
    closed: 'Geschlossen',
    ghPrsForRepo: '{{state}} PRs für {{repo}}'
  }
};

/**
 * Determine the current locale from an Astro request URL, stripping any
 * configured Astro `base` first so it matches Apostrophe's locale prefixes.
 *
 * @param {URL} url - Astro.url
 * @returns {string}
 */
export function getLocale(url) {
  const pathname = url.pathname.slice(getBase().length) || '/';
  for (const [ prefix, locale ] of Object.entries(LOCALE_PREFIXES)) {
    if (pathname === prefix || pathname.startsWith(`${prefix}/`)) {
      return locale;
    }
  }
  return 'en';
}

/**
 * Translate a key for the given locale, with {{var}} interpolation.
 * Falls back to English, then to the raw key, if a translation is missing.
 *
 * @param {string} locale
 * @param {string} key
 * @param {Record<string, string>} [vars]
 * @returns {string}
 */
export function t(locale, key, vars = {}) {
  const dict = translations[locale] || translations.en;
  const template = dict[key] || translations.en[key] || key;
  return template.replace(/{{\s*(\w+)\s*}}/g, (_, name) => vars[name] ?? '');
}
