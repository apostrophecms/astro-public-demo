/**
 * Astro base-path helpers.
 *
 * `import.meta.env.BASE_URL` is `/` when no `base` is configured, or
 * `/prefix/` (with trailing slash) when one is set.
 * These helpers normalise that into a consistent, no-trailing-slash form
 * so every path built from it looks like `${base}/rest/of/path`.
 *
 * Rules:
 *  - `getBase()` never ends with `/`  (returns `''` when there is no prefix).
 *  - Every consumer that appends to it starts with `/`:
 *      `${getBase()}/fonts/foo.woff2`   → `/fonts/foo.woff2`  (no prefix)
 *      `${getBase()}/fonts/foo.woff2`   → `/my-app/fonts/foo.woff2`  (with prefix)
 *  - For a link to the site root use `basePath('/')`.
 */

/**
 * Return the configured Astro base path **without** a trailing slash.
 * Returns an empty string when no base is configured.
 *
 * @returns {string}
 */
export function getBase() {
  return import.meta.env.BASE_URL.replace(/\/+$/, '');
}

/**
 * Prepend the Astro base path to an absolute pathname.
 *
 * The pathname **must** start with `/`.
 * When there is no base the path is returned as-is.
 *
 * @param {string} pathname - An absolute path, e.g. `/fonts/foo.woff2`
 * @returns {string}
 *
 * @example
 *   // No base configured
 *   basePath('/')          // → '/'
 *   basePath('/about')     // → '/about'
 *
 *   // base = '/my-app'
 *   basePath('/')          // → '/my-app/'
 *   basePath('/about')     // → '/my-app/about'
 */
export function basePath(pathname) {
  return `${getBase()}${pathname}`;
}

/**
 * The path to append to an index page's `_url`, or a piece's `_parentUrl`,
 * to filter it by one choice. Mirrors `apos.url.getChoiceFilter()` on the
 * backend, where `static: true` makes filters paths rather than query strings.
 *
 * Inside the article index template, prefer the `_url` of a `filters` choice.
 *
 * @param {string} name - The filter name, e.g. `categories`
 * @param {string} value - The choice value, usually a slug
 * @param {number} [page] - The page number; omitted from the path when 1
 * @returns {string}
 *
 * @example
 *   article._parentUrl + getChoiceFilter('categories', 'news')
 *   // → '/articles/categories/news'
 */
export function getChoiceFilter(name, value, page = 1) {
  return `/${encodeURIComponent(name)}/${encodeURIComponent(value)}${page > 1 ? `/page/${page}` : ''}`;
}
