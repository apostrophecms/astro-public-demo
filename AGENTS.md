# AGENTS.md — astro-public-demo

Machine-readable project brief for AI coding assistants. Facts and conventions only. For anything
not covered here — API details, options, edge cases — consult the docs:
https://apostrophecms.com/docs/

---

## Architecture

Hybrid monorepo: ApostropheCMS (port 3000) is the headless backend — it owns all content schemas, widgets, page types, pieces, and the admin UI. Astro (port 4321) is the frontend renderer — it fetches content from ApostropheCMS via REST and maps it to Astro components. The `@apostrophecms/apostrophe-astro` bridge package connects them and enables in-context editing.

Start dev: `npm run install-all` then `npm run dev` → visit `http://localhost:4321`

## Adding a Widget

1. Create `backend/modules/my-widget/index.js` — set `extend: '@apostrophecms/widget-type'`, `options.label`, and `fields.add`.
2. Register in `backend/app.js`: add `'my-widget': {}` to the `modules` object.
3. Create `frontend/src/widgets/MyWidget.astro`. Widget data arrives as `Astro.props.widget`.
4. Add the mapping in `frontend/src/widgets/index.js`: `'my': MyWidget`. The key is the widget type — the module name without the `-widget` suffix.
5. Add the widget to an area's `widgets` config (also by widget type: `'my': {}`) in the relevant backend schema (import from `backend/lib/area.js` or inline).
6. If the widget needs client-side JavaScript, see **Client-Side Widget JavaScript** below — do not add an inline `<script>` to the `.astro` file.

The key in `index.js` must be the widget type exactly. A mismatch renders nothing; the only sign is a "Missing widget mapping for <type>" error in the frontend server log.

## Client-Side Widget JavaScript

**The rule:** a web component must be *registered* independently of whether its widget rendered on the page. `customElements.define()` writes to a single document-global registry, so registration was never a component-scoped concern to begin with.

Never put an inline `<script>` in a widget's `.astro` file. Astro hoists a component-scoped script into the page bundle only for components that server-render on that page. When an editor *adds* a widget in-context, Apostrophe injects the markup client-side, the script is not in the bundle, and the widget silently does nothing — with no console error.

Register at page level instead:

1. Put the class and its `customElements.define()` call in `frontend/src/widgets/MyWidget.ts`.
2. Add `import './MyWidget';` to `frontend/src/widgets/players.ts`.
3. `players.ts` is already loaded from the `endBody` slot in `frontend/src/pages/[...slug].astro`; nothing else is needed.

Resolve data in the component's frontmatter and pass it to the element as a `data-` attribute rather than fetching from inside the element. apostrophe-astro re-renders through Astro on every edit-mode change, so server-resolved data stays current.

```astro
---
// aposFetch is server-side only — never import it into client code.
import { aposFetch } from '@apostrophecms/apostrophe-astro/helpers/server';
const response = await aposFetch('/api/v1/...');
const payload = response.ok ? JSON.stringify(await response.json()) : '';
---
<my-widget data-payload={payload}></my-widget>
```

`VideoWidget.astro` / `VideoWidget.ts` is the reference implementation.

Never fetch from an Apostrophe API route in client-side code. Besides the freshness problem above, it breaks any [static build](https://apostrophecms.com/docs/tutorials/astro/static-builds-with-apostrophecms-astro.html) outright — the backend is not running at runtime, so the request fails on the deployed site.

Registration of web components must be eager; the *implementation* behind it need not be. Everything `players.ts` imports ships on every page, so if it grows large, move the heavy code behind a dynamic `import()` inside `connectedCallback` and keep only the `customElements.define()` call at page level. Note that a dynamic import also stops Astro inlining the script into each page's HTML, making it a separately cached file instead.

## Layout Slots

Slot content is passed from `frontend/src/pages/[...slug].astro`, as children of `<AposLayout>` carrying a `slot` attribute. The available slots are `startHead`, `standardHead`, `extraHead`, `startBody`, `beforeMain`, `main`, `afterMain` and `endBody` — typically meta tags in `standardHead`, a site header in `beforeMain`, page content in `main`, a footer in `afterMain`, and page-level scripts in `endBody`.

`AposLayout` renders `beforeMain`, `main` and `afterMain` as siblings, with Apostrophe's `prependMain` / `appendMain` injections bracketing the `main` slot. A project wrapper like `<main>` belongs **inside** the `main` slot.

In this project each template in `frontend/src/templates/` renders its own `<main>`, so breadcrumbs and page titles can sit outside it. Do not wrap `<AposTemplate>` in `<main>` in `[...slug].astro`; give a new page template its own `<main>` instead.

Do not split an element's opening and closing tags across `beforeMain` and `afterMain` to wrap the main slot — Astro drops attributes on a closing tag, so the element closes early, the whole subtree lands in `beforeMain`, and the injections render outside it.

## Adding a Page Type

1. Create `backend/modules/my-page/index.js` — set `extend: '@apostrophecms/page-type'` and `fields.add`.
2. Register in `backend/app.js`: add `'my-page': {}` to the `modules` object.
3. Add to the `types` array in `backend/modules/@apostrophecms/page/index.js` so editors can select it.
4. Create `frontend/src/templates/MyPage.astro`. Page data arrives as `Astro.props.page`.
5. Add the mapping in `frontend/src/templates/index.js`: `'my-page': MyPage`.

## The `_` Prefix Convention

Fields starting with `_` are relationship fields. Apostrophe populates them at request time and returns them as **arrays**, even when `max: 1`.

```js
// Relationship fields are populated at request time and returned as arrays; [0] gets the first result.
const image = widget._image?.[0];        // first image from a max:1 relationship
const author = article._authors?.[0]?.title;
```

## Filter and Pagination URLs

`backend/modules/@apostrophecms/url` sets `static: true`, so piece-page filters and pages are **paths**,
not query strings: `/articles/categories/news/page/2`, not `/articles?categories=news&page=2`.
This is also what lets the static build enumerate every listing.

- Filters are declared in `piecesFilters` on `backend/modules/article-page/index.js` (`categories`,
  `authors`). Each arrives in `aposData.filters`, with a `_url` and `active` flag per choice.
- In the index template, link to a filter through its choice's `_url`, and build pager links with
  `buildPageUrl()` from `@apostrophecms/apostrophe-astro/helpers`; don't build these URLs yourself.
- Elsewhere, append `getChoiceFilter(name, value, page)` from `frontend/src/utils/url.js` to a
  piece's `_parentUrl`. Never use `_parentSlug`: it lacks the `/fr` or `/de` locale prefix.
- A static URL expresses one filter at a time.

## Article Authors

Articles credit **`author` pieces** through `_authors` (coauthors allowed), never users.
An author is a byline and may have no user account at all.

- `author` is `localized: false`: one author per person, shared by every locale.
- A user links to at most one author through their own `_author` field, which admins can set.
- `apos.author.ensureForUser(user)` returns that author, creating and linking a new one if the
  user has none or theirs was archived or deleted.
  It runs when a user starts a new article (the default `_authors`) and whenever they save one.
- A user's display name change is copied to their author unless `syncUserName: false`. Nothing
  else syncs, and archiving a user leaves their author untouched.
- Render bylines with `frontend/src/components/Byline.astro`, which joins names per locale.
- Do not add relationships to `@apostrophecms/user` for anything visitors see.

## Shared Field Utilities — Backend (`backend/lib/`)

- **`lib/link.js`** — Canonical link field set (`linkType`, `_linkPage`, `_linkFile`, `linkUrl`, `linkTarget`). Spread with `...linkConfig.link` into any schema needing a link. Do not copy these fields manually.
- **`lib/area.js`** — Exports `basicConfig`, `fullConfig`, `fullConfigExpandedGroups`. Import the right one for each area's `widgets` option.

## Frontend Utilities

**`frontend/src/utils/link.js`** — Canonical link resolution. Always use these; do not navigate `_linkPage[0]._url` manually.
- `getLinkPath(link)` — resolves a link object (page, file, or custom URL) to a URL string.
- `opensInNewTab(linkTarget)` — returns `true` if `linkTarget` is `['_blank']`.

```js
import { getLinkPath, opensInNewTab } from '../../utils/link.js';
const href = getLinkPath(widget);          // works for all three linkType values
const newTab = opensInNewTab(widget.linkTarget);
```

**`@apostrophecms/apostrophe-astro/lib/attachment.js`** — Canonical image helpers. Use these for all image rendering; do not navigate `widget._image[0].attachment` manually. See `ImageWidget.astro` for the reference implementation.
- `getAttachmentUrl(imageObj)` — returns the image URL.
- `getAttachmentSrcset(imageObj)` — returns a `srcset` string for responsive images.
- `getFocalPoint(imageObj)` — returns an `object-position` CSS value (e.g. `"40% 60%"`).
- `getWidth(imageObj)` / `getHeight(imageObj)` — return intrinsic dimensions for layout shift prevention.

```js
// Image helpers from the integration package — use these instead of navigating widget._image[0].attachment manually.
import { getAttachmentUrl, getAttachmentSrcset, getFocalPoint, getWidth, getHeight }
  from '@apostrophecms/apostrophe-astro/lib/attachment.js';

const imageObj = widget._image?.[0];
const src = getAttachmentUrl(imageObj);
const srcset = getAttachmentSrcset(imageObj);
```

## AposArea

```astro
---
// AposArea renders a CMS-editable widget sequence. The matching field is defined in the backend schema.
import AposArea from '@apostrophecms/apostrophe-astro/components/AposArea.astro';
const { page } = Astro.props;
---
<AposArea area={page.main} />
```

## i18n Key Convention

The starter uses the `project:` namespace by default: `label: 'project:myField'`.
Translations live in `backend/modules/@apostrophecms/i18n/i18n/project/`.
Add keys there or introduce your own namespace with a matching folder under `i18n/`.

## Component Registries

```
frontend/src/templates/index.js   Maps page type names → Astro components
frontend/src/widgets/index.js     Maps widget names → Astro components
```

Template keys must match the page type's backend module name exactly. Widget keys must match the widget type: the backend module name without the `-widget` suffix (e.g. module `@apostrophecms/rich-text-widget` → key `'@apostrophecms/rich-text'`, module `hero-widget` → key `'hero'`). A wrong widget key renders nothing, with no browser console error — the only sign is a "Missing widget mapping for <type>" error in the frontend server log. A wrong template key silently falls back to the `apos-no-template` template if one is mapped.

## Project Constraints

- Do not change existing HTML class names — they are tied to existing SCSS.
- Do not rename or alter field names in `backend/lib/link.js` — widget components and frontend utils depend on them.
- `card-title-rt` and `card-content-rt` reuse `RichTextWidget` in the registry intentionally — they are inline rich-text variants.
- Widget visual variants use the widget's `styles` property in `index.js`, not `select` schema fields for appearance.
- Frontend is presentation-only — never change backend schemas from the frontend side.

## Architecture Guide

Full explanations, annotated examples, and walkthroughs: **[Astro Architecture Guide](https://docs.apostrophecms.org/guide/astro-demo-overview.html?utm_source=astro-starter&utm_medium=claude-file&utm_campaign=architecture-guide)**

## Team Conventions

<!-- Add your team's own conventions below. Keep entries as facts, file paths and rules. -->
