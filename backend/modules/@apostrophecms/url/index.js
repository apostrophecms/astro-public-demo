export default {
  options: {
    // Filter and pagination URLs become paths (`/articles/categories/news/page/2`)
    // rather than query strings, so every listing is a distinct, enumerable
    // URL the static build can generate. On the frontend, use the `_url` of a
    // `filters` choice, `buildPageUrl()` from @apostrophecms/apostrophe-astro,
    // or append to a piece's `_parentUrl`, never a query string.
    static: true
  }
};
