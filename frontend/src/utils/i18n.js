/**
 * Minimal frontend translation helper.
 *
 * Astro runs as its own server process, separate from ApostropheCMS, so
 * frontend components have no access to the backend's req.t()/__t(). The
 * dictionaries in ../i18n/*.json cover the handful of strings the site
 * chrome (header, footer, article templates, GitHub PR widget) renders
 * directly, so switching locale doesn't leave a mix of languages on the
 * page. One flat JSON file per locale, same shape as the backend's own
 * i18next-format files, so both are equally easy to hand-edit or extend.
 *
 * Files are picked up automatically by folder — adding a new locale is
 * just adding ../i18n/<locale>.json, the same way dropping a new file into
 * backend/modules/@apostrophecms/i18n/i18n/project/ is all core needs.
 *
 * The backend remains the source of truth for content and for the CMS-side
 * `project:` translation namespace (backend/modules/@apostrophecms/i18n/i18n/project/).
 */

const localeModules = import.meta.glob('../i18n/*.json', { eager: true });

const translations = {};
for (const [ path, module ] of Object.entries(localeModules)) {
  const [ , locale ] = path.match(/([^/]+)\.json$/);
  translations[locale] = module.default ?? module;
}

/**
 * Determine the current locale from the Apostrophe page payload. The
 * backend already computes this (`req.data.i18n.locale`, set by
 * ApostropheCMS core's i18n module) and forwards it as `aposData.i18n`, so
 * the frontend never needs to know the locale's URL prefix or domain
 * scheme itself.
 *
 * @param {object} aposData - Astro.props.aposData
 * @returns {string}
 */
export function getLocale(aposData) {
  return aposData?.i18n?.locale || 'en';
}

/**
 * Bind a translator to a single locale, mirroring the ergonomics of
 * ApostropheCMS core's `__t()` Nunjucks helper (itself bound to `req.t()` for
 * the current request's locale) — callers pass just a key, never a locale.
 *
 * @param {string} locale
 * @returns {(key: string, vars?: Record<string, string>) => string}
 */
export function createTranslator(locale) {
  const dict = translations[locale] || translations.en;
  return function __t(key, vars = {}) {
    const template = dict[key] || translations.en[key] || key;
    return template.replace(/{{\s*(\w+)\s*}}/g, (_, name) => vars[name] ?? '');
  };
}
