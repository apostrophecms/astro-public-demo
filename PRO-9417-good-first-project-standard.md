# Good First Project Standard
**PRO-9417 · Starter Kit Consolidation — Analysis & Planning**
*Applies to: ApostropheCMS Standalone starter and ApostropheCMS + Astro starter*

---

## Purpose and Scope

This document defines the minimum bar that both starter repositories must meet before they can serve as primary starting points for new projects. The target reader is **a developer who has never seen ApostropheCMS before** — specifically someone coming from a React bootcamp or similar JavaScript-first background who understands modern JS but has never worked with a server-rendered CMS framework.

The standard is also written so that an experienced backend engineer picking up the repo for the first time does not see code they would be embarrassed to ship. Junior-friendly and professionally credible are not in tension here; the standard is designed to satisfy both.

Two engineers working on separate repos should be able to read this document and independently produce consistent results.

---

## 1. Documentation Standards

### 1.1 Root README

The root README is the first thing a developer sees and the last thing they should need to consult for basic orientation. It must cover the following topics, in roughly this order.

**What this is and why it exists.** One paragraph that names the architecture (e.g. "headless ApostropheCMS backend + Astro frontend") and states plainly what a developer can build with it. Marketing copy is fine here, but it must be honest about what the kit is — a starting point, not a production-ready product.

**Prerequisites.** Exact version requirements for Node, MongoDB, and any other hard dependencies. Links to installation guides for each. Do not assume the developer has MongoDB running.

**Quick Start.** A copy-paste sequence that gets the site running in under five minutes on a clean machine. The sequence must include: cloning, installing dependencies, setting required environment variables, starting both servers, creating an admin user, and the URL to visit. Every command must be shown exactly as typed.

**Architecture overview.** A short-form diagram (ASCII tree or equivalent) showing the monorepo layout, with one-line descriptions of each directory's purpose. Follow the diagram with a numbered list of how a page request flows from the browser through the system and back. This is the section that orients developers who have never seen a headless CMS before.

**How to extend.** Step-by-step instructions for the two most common extension tasks: adding a new widget and adding a new page type. Each task should be expressed as a numbered checklist. This prevents the most common "I changed the backend but nothing appeared in the frontend" error.

**Environment variables reference.** A table listing every environment variable the project uses, whether it is required or optional, its default value if any, and a plain-English description of what it controls.

**Deployment.** At minimum, a brief section on ApostropheCMS Hosting (managed) and a note on self-hosted deployment covering what the backend and frontend each need.

**Resources.** Links to official ApostropheCMS docs, Astro docs, the integration package, and community Discord. These should be at the bottom, not scattered through the document.

**What the README must not do.** It must not explain ApostropheCMS concepts in depth — that belongs in the Architecture Guide (see section 1.3). It must not duplicate content that is already accurate and maintained in official documentation. It must not exceed roughly 250 lines; if it does, content should move to the Architecture Guide or inline comments.

### 1.2 Sub-package READMEs *(Astro starter only)*

The Astro starter is a monorepo with a `backend/` and `frontend/` sub-package. Each should have a README that:

- States the package's role in one sentence.
- Provides the command to run it standalone.
- Points to the root README for full setup.
- Notes anything specific to that package that a developer would need to know while working in it in isolation (e.g. which port it listens on, how to run its tests if any).

Sub-package READMEs must not be stubs that just say "see the main README." A developer context-switching into that directory should learn something useful in five seconds.

The Standalone starter is a single-app project and has no sub-packages. All orientation content goes in the root README and Architecture Guide.

### 1.3 Architecture Guide

The Architecture Guide has two parts that serve different audiences and purposes and must be treated as a pair.

**Part A — In-repo orientation file (`ARCHITECTURE.md`)**

A short file (50–80 lines) that lives at the repo root and serves two audiences: developers who are deep in the codebase and want a quick reference without leaving their editor, and LLM coding assistants that benefit from a structured project brief alongside `CLAUDE.md`. It is *not* a tutorial. It covers only the concepts that cause the most confusion without explanation — the minimum a developer needs to orient themselves in the code.

Required content for both starters: the `_` prefix convention and why relationships are arrays; the `lib/` utilities and when to use each; the i18n `project:` key convention and where translations live; the `styles` module convention for CMS-controlled widget styling; and a prominent link to Part B (the docs site guide) for deeper explanations and examples.

Additional content for the Astro starter: the component registry key-matching rule and which two files contain the registries.

Additional content for the Standalone starter: that templates are auto-discovered by filename convention (no registry); the four names in the template inheritance chain and which one to edit; and the names of the `data.*` sources available in templates.

**Part B — Docs site Architecture Guide (hosted)**

The full walkthrough with prose explanations, code examples, and the depth a developer new to Apostrophe actually needs. This lives on the ApostropheCMS docs site, not in the repo, which means it can be updated independently of repo releases and its traffic can be measured.

Each starter's README must link to its corresponding docs site guide using a UTM-tagged URL. The UTM parameters should identify the source starter and the link location so that clicks can be tracked as a proxy for onboarding demand. For example:

```
https://docs.apostrophecms.org/guide/astro-architecture.html
  ?utm_source=astro-starter
  &utm_medium=readme
  &utm_campaign=architecture-guide
```

The same link should also appear in `ARCHITECTURE.md` and in `CLAUDE.md` so that the signal is captured regardless of where developers enter the documentation path.

**Docs site guide content — both starters:** a full explanation of each topic listed in Part A, written in prose with annotated code examples. Aim for 600–1,000 words per starter.

**Docs site guide content — Astro starter only:** how ApostropheCMS and Astro divide responsibility; the bridge package and what `aposPageFetch` does; a full explanation of the component registry pattern with a before/after example; area fields and `<AposArea>` with a backend schema snippet and its Astro counterpart; the `frontend/src/utils/link.js` functions (`getLinkPath()`, `opensInNewTab()`); and the image helpers from `@apostrophecms/apostrophe-astro/lib/attachment.js` — `getAttachmentUrl()`, `getAttachmentSrcset()`, `getFocalPoint()`, `getWidth()`, and `getHeight()` — with `ImageWidget.astro` as the annotated canonical example.

**Docs site guide content — Standalone starter only:** how templates and widgets are discovered by filename convention; the full four-level template inheritance chain with guidance on which level to edit; the complete `data` object reference (`data.page`, `data.piece`, `data.global`, `data.home`, `data.widget`); the `{% area %}` tag with a schema-to-template example; the helper module and how `apos.helper.functionName()` is called in templates; Nunjucks macros and the `{% import %}` pattern; and the two-step `apos.attachment.url()` image resolution pattern.

### 1.4 LLM Context File (`CLAUDE.md` / `llm-context.md`)

Both starters must ship with a file at the repo root designed to give an AI coding assistant accurate, project-specific context. This file is not documentation for humans — it is a machine-readable project brief.

**Required content — both starters:**

- Architecture summary (two to three sentences describing the approach).
- The command(s) to start the project in development.
- How to add a widget (numbered steps, exact file paths).
- How to add a page type (numbered steps, exact file paths).
- The `_` prefix convention and why relationships are arrays.
- Where shared field utilities live (`lib/link.js`, `lib/area.js`) and what they cover.
- The i18n key convention and where translations live.
- Any project-specific constraints (e.g. "do not change HTML structure or CSS class names — these are tied to existing stylesheets").

**Additional required content — Astro starter:**

- The component registry files (`frontend/src/templates/index.js`, `frontend/src/widgets/index.js`) and the rule that keys must match backend module names exactly.
- That `frontend/src/utils/link.js` contains the canonical link resolution functions (`getLinkPath()`, `opensInNewTab()`).
- That `@apostrophecms/apostrophe-astro/lib/attachment.js` exports the canonical image helpers (`getAttachmentUrl()`, `getAttachmentSrcset()`, `getFocalPoint()`, `getWidth()`, `getHeight()`), that these must be used instead of navigating the attachment object manually, and that `ImageWidget.astro` is the reference example.

**Additional required content — Standalone starter:**

- That Nunjucks templates are auto-discovered by filename convention (`modules/{name}/views/widget.html`, `modules/{name}/views/page.html`) — no registry to update.
- That `data.widget`, `data.page`, `data.piece`, and `data.global` are the primary data sources in templates.
- That `modules/helper/index.js` is where server-side template helpers are registered and that `apos.helper.linkPath()` is the canonical link resolver.
- That `views/link.html` contains shared Nunjucks macros imported with `{% import %}`.

This file should be under 150 lines. It is a context primer, not a tutorial. If the project already has a `CLAUDE.md`, it must be kept current whenever the project's conventions change.

### 1.5 Inline Comments vs. Separate Guides

| Content type | Where it lives |
|---|---|
| What a file or function does | Inline comment or JSDoc at the top of the file/function |
| Why a non-obvious pattern was chosen | Inline comment at the point of use |
| How a concept works in Apostrophe generally | Architecture Guide |
| How to do a common task | README (brief) or Architecture Guide (detailed) |
| API reference for a utility function | JSDoc on the function |

---

## 2. Inline Comment Standards

### 2.1 The Core Principle

Comment the *why*, not the *what*. A developer who knows JavaScript and can read the code does not need `// loop over items`. They do need to know why `widget._image?.[0]` and not `widget.image`, or why `area.js` exports three configurations instead of one.

### 2.2 Patterns That Require a Comment

The following patterns are non-obvious to developers new to Apostrophe and must have a comment at or near their first meaningful use in each file.

**Both starters:**

*The `_` prefix on relationship fields.* Add a single-line comment the first time it appears in a template or component: `// Relationship fields are populated at request time and returned as arrays; [0] gets the first result.`

*Spread of shared field configurations.* When using `...linkConfig.link` or a similar spread from `lib/`, add a comment pointing to the source: `// Full link field set — see lib/link.js.`

*Area configuration exports.* In `lib/area.js`, each exported configuration (`basicConfig`, `fullConfig`, `fullConfigExpandedGroups`) needs a one-line comment explaining which page or widget type uses it and why that scope was chosen.

*Conditional field visibility (`if:`).* When a field uses `if:` to show conditionally, add a comment naming the controlling field, because this is invisible from the field definition alone.

*Non-standard module registrations in `app.js`.* When a module is registered with inline configuration (e.g. the `card-title-rt-widget` extension of rich text), add a comment explaining why it is configured inline rather than in its own directory.

**Astro starter only:**

*`AposArea` usage.* Add a brief comment on the first `<AposArea>` in each file: `<!-- AposArea renders a CMS-editable widget sequence. The matching field is defined in the backend schema. -->`

*`aposPageFetch` in `[...slug].astro`.* A comment explaining that this function fetches all page data from the ApostropheCMS backend, and that downstream templates receive `aposData.page` for regular pages or `aposData.piece` for piece-type show pages.

*Component registry entries.* A short comment block at the top of `frontend/src/widgets/index.js` and `frontend/src/templates/index.js` explaining that keys must match backend module names exactly and what breaks if they do not.

*Image helper imports.* In any component that renders an image, a single-line comment above the import block pointing to the source: `// Image helpers from the integration package — use these instead of navigating widget._image[0].attachment manually.` This surfaces the helpers to developers writing new image-bearing components who would otherwise miss them.

**Standalone starter only:**

*The `{% area %}` tag.* Add a brief Nunjucks comment on the first `{% area %}` call in each template: `{# Renders a CMS-editable widget sequence. First arg is the document, second is the field name from the backend schema. #}`

*`data.widget` and `data.page` in templates.* Add a short comment block near the top of `layout.html` and each widget template noting the primary data sources available (`data.page`, `data.piece`, `data.global`, `data.widget`) and pointing to the Architecture Guide for a full explanation. React-background developers will otherwise spend time looking for props or imports that do not exist.

*`self.addHelpers()` in `modules/helper/index.js`.* A JSDoc-style comment on the module itself explaining that these functions are available in all Nunjucks templates as `apos.helper.functionName()`, and that this is the correct place to add new shared template logic.

*`apos.attachment.url()` calls.* A comment on the first attachment URL resolution in `layout.html` explaining the two-step pattern: `apos.image.first()` extracts the attachment object from the relationship array, then `apos.attachment.url()` resolves it to a URL with an optional size variant.

### 2.3 Patterns That Do Not Need a Comment

Do not comment the following. Comments here become noise that obscures the signal.

- Standard schema field types (`string`, `boolean`, `select`, `area`, `array`) when their purpose is clear from the field name.
- `import` statements.
- Standard Astro `Astro.props` destructuring.
- Simple conditional rendering (`widget.links?.length > 0`).
- Module `extend` declarations — the module name is self-documenting.
- Any code pattern that is thoroughly covered in the official ApostropheCMS or Astro documentation and is used exactly as documented.

### 2.4 Comment Quality

Comments must be written in complete sentences when they explain a concept. Single-line notes do not need to be full sentences, but they must be clear in isolation — assume the developer reading the comment has not read anything else in the file.

Avoid comments that will become stale: do not write "there are three widget configs" when the number may change. Describe behavior, not counts.

### 2.5 Widget Component Structure *(Astro starter only)*

A widget component must be self-contained enough that a developer can understand how it works by reading a single file. The reference implementations exist to be copied and adapted; a component that requires opening three files just to trace a value from CMS data to rendered HTML fails that purpose regardless of how clean each individual file is.

**The two-level rule.** A widget component may delegate to one sub-component when there is a genuine, demonstrated reuse case — the sub-component is used in three or more distinct places. A chain deeper than two levels (widget → sub-component → sub-sub-component) is not permitted in the reference implementations.

**Consistency over cleverness.** When two widgets solve the same rendering problem (e.g. outputting an image), they must use the same approach. A reference implementation that handles images three different ways across its widget files is harder to learn from than one that is slightly less DRY but entirely consistent.

**When delegation is warranted.** If a widget component does delegate to a sub-component, the widget file must have a comment at the import statement explaining why: what the sub-component does, why it is separate, and where a developer would go to change the rendered markup. The sub-component must also be reachable from the widget without further indirection.

**Workarounds must be visible.** If a component contains a fix for an edge case in the data (e.g. patching a missing field from a REST API response), that fix must have an inline comment explaining the condition it handles and why it cannot be resolved upstream. A silent data mutation with no comment is a trap for any developer who later changes the data source.

---

## 3. Editorial Pattern Standards

### 3.1 What "Editorial Pattern" Means

An editorial pattern is a piece of functionality that a non-technical editor should be able to use without developer assistance. Both starters must demonstrate, and document, a consistent set of these patterns. If a pattern is present in one starter, it must either be present in the other or explicitly excluded with a note in that starter's README.

### 3.2 Required Patterns in Both Starters

Both starters must include a working, documented implementation of each of the following.

**Buttons and calls-to-action.** Both starters include buttons in multiple contexts: a standalone button widget, buttons embedded in a hero, and a button embedded in a card. This is intentional — an editor placing a CTA inside a hero is doing something contextually different from placing a standalone button below a paragraph. The flexibility is correct; the inconsistency is not.

Every widget that exposes a button or link to an editor — standalone or embedded — must offer the same style choices (at minimum: primary and outline) via a `style` field using consistent values. An editor who can choose primary/outline on a hero CTA must be able to make the same choice on a standalone button. Implementations that use the `styles` module for visual control and implementations that use a `style` schema field are not equivalent from an editorial perspective and must not be mixed across widget types.

Every button-bearing widget must use the shared `lib/link.js` field configuration. Deep copies via `klona` are acceptable when conditional field visibility requires it, but the field names, types, and choices must remain identical to the source.

Widgets that contain their own built-in button (hero, card, price card) must document in the Architecture Guide that editors should use the widget's built-in link fields for CTAs within that component rather than nesting a standalone ButtonWidget inside it. Without this guidance, editors will do both and produce inconsistent results.

**Images.** A single-image widget (or image field within a widget) that supports the standard ApostropheCMS attachment relationship, uses optional chaining (`widget._image?.[0]`) correctly, and renders with responsive-ready markup. Both starters must demonstrate the `apos-attachment` URL pattern or its equivalent.

**Video.** The `@apostrophecms/video-widget` must be present and functional. The frontend component must handle the case where no video has been selected yet (empty state).

**Rich text.** The `@apostrophecms/rich-text-widget` must be configured with a sensible, constrained toolbar. The starter must not expose the full toolbar to editors by default. The choice of toolbar items must be documented in the Architecture Guide or inline comment.

**Navigation and links (global).** The site header must demonstrate how to access global settings from a template (`aposData.global`), and the nav must show how to traverse a page relationship. This pattern is the first thing most developers will need to adapt.

**Articles or blog posts (piece type).** At minimum, an index page and a show page, demonstrating the `piece-type` + `piece-page` pattern. This is the canonical example of how Apostrophe manages repeating content.

### 3.3 Alternative Approaches

When there is more than one valid way to implement a pattern in Apostrophe, the starter must pick one and use it consistently. Alternative approaches are handled as follows.

- If an alternative is a common decision point (e.g. whether to use an inline rich-text widget vs. a string field for a card title), document it in the Architecture Guide with a brief explanation of the tradeoff.
- If an alternative is advanced or outside scope, link to official documentation.
- Do not leave two competing implementations of the same pattern in the repo. Choose one.

### 3.4 Non-Technical Editor Capabilities

Without any developer assistance, a non-technical editor using either starter must be able to:

- Create and publish a new page of any available type.
- Add, reorder, and remove widgets on any editable area.
- Add and format body text using the rich-text widget.
- Upload and place an image.
- Embed a video using a URL.
- Add a button or CTA with any of the three link types (page, file, custom URL).
- Create and publish a new article (or equivalent piece type).
- Edit the site navigation via Global Settings.

If any of these tasks requires knowledge that is not surfaced by the CMS's own labels and help text, those labels and help text must be improved. Developer documentation is not a substitute for clear editor UI.

### 3.5 Help Text in Schemas

Every schema field that is not self-evident from its label must include a `help` property. Help text is the editor's first line of support. It should describe what the field controls, not restate the label. For example, `help: 'project:buttonLinksDescription'` is correct; `help: 'project:links'` (restating the label) is not.

---

## 4. Consistency Checklist

The following checklist can be used when reviewing a starter against this standard. A starter is ready when every item is checked.

### Documentation
- [ ] Root README covers all sections in 1.1 and stays under ~250 lines *(both)*
- [ ] README links to the docs site Architecture Guide using a UTM-tagged URL *(both)*
- [ ] Sub-package READMEs are informative, not just stubs *(Astro only)*
- [ ] `ARCHITECTURE.md` (Part A) exists, is 50–80 lines, covers the shared required content from 1.3, and links to the docs site guide *(both)*
- [ ] `ARCHITECTURE.md` includes the component registry key-matching rule *(Astro only)*
- [ ] `ARCHITECTURE.md` covers template auto-discovery, inheritance chain names, and `data.*` sources *(Standalone only)*
- [ ] Docs site Architecture Guide (Part B) exists for this starter with all required content from 1.3 *(both)*
- [ ] Docs site guide URL uses consistent UTM parameters identifying the starter and link location *(both)*
- [ ] `CLAUDE.md` (or equivalent LLM context file) exists and covers all items in 1.4 *(both)*
- [ ] Environment variables table is complete and accurate *(both)*

### Inline Comments
- [ ] `_` prefix convention is explained at first use in every template or component file that uses it *(both)*
- [ ] `lib/area.js` exports are annotated with when to use each *(both)*
- [ ] `app.js` module registrations with inline config have explanatory comments *(both)*
- [ ] `AposArea` usage has a brief explanatory comment in every file where it appears *(Astro only)*
- [ ] Component registries (`widgets/index.js`, `templates/index.js`) have a comment block explaining the key-matching rule *(Astro only)*
- [ ] `[...slug].astro` has a comment on `aposPageFetch` *(Astro only)*
- [ ] `{% area %}` tag has a brief comment at first use in each template *(Standalone only)*
- [ ] `layout.html` has a comment noting the available `data.*` sources *(Standalone only)*
- [ ] `modules/helper/index.js` has a JSDoc comment on the module explaining how helpers are called in templates *(Standalone only)*
- [ ] First `apos.attachment.url()` call in `layout.html` has a comment explaining the two-step pattern *(Standalone only)*
- [ ] No self-evident code is commented (the ceiling is respected) *(both)*
- [ ] No widget component chain exceeds two levels deep *(Astro only)*
- [ ] All widgets that render the same type of content (e.g. images) use the same approach *(Astro only)*
- [ ] Any silent data mutations or edge-case fixes have an explanatory inline comment *(both)*

### Editorial Patterns
- [ ] Button/CTA widget present with page, file, and custom URL link types
- [ ] Image widget present with correct relationship pattern
- [ ] Video widget present with empty-state handling
- [ ] Rich text present with constrained toolbar, choices documented
- [ ] Global settings nav pattern demonstrated
- [ ] Piece type (articles or equivalent) with index and show pages
- [ ] All editorial patterns consistent between both starters (or differences noted)

### Editor Experience
- [ ] All non-obvious fields have `help` text
- [ ] A non-technical editor can complete all tasks in section 3.4 without asking for help

---

## 5. What Is Out of Scope

This standard does not cover:

- **Visual design.** Both starters may have different design systems. This standard does not prescribe CSS conventions, utility-class choices, or design tokens.
- **Testing.** Unit and integration test requirements are out of scope for this ticket and belong in a separate standard.
- **Performance budgets.** Lighthouse scores and bundle size limits are not covered here.
- **Localization completeness.** The i18n key convention is standardized (section 1.3), but the number of supported locales and translation coverage is not.

---

---

## Appendix: Current State Assessment

This section is not part of the standard itself — it records findings from the review that produced this document, to inform prioritization of work.

**Astro starter (`astro-public-demo`).** The root README is solid and already meets most of section 1.1. The `CLAUDE.md` exists and is reasonably complete. Neither `ARCHITECTURE.md` nor the sub-package READMEs meet the standard. Inline comments are sparse — the utilities (`utils/link.js`) have JSDoc, but widget templates and index registries have none. The editorial patterns are present and functional.

**Standalone starter (`public-demo`).** The root README is a stub — 20 lines covering only setup commands. There is no `CLAUDE.md` and no `ARCHITECTURE.md`. The Nunjucks template files have minimal inline comments; `modules/helper/index.js`, `views/link.html`, and `views/layout.html` have none. The `outerLayout.html` file is the only template with a meaningful comment block (and it is good). The editorial patterns are present and functional.

The Standalone starter has the larger documentation gap and should be treated as the higher-priority item in the implementation phase.

**Code quality flag — Astro starter (action required before release):**

The image rendering path violates section 2.5 in two ways and must be resolved before the Astro starter can be considered a clean reference implementation.

First, `ImageWidget.astro` delegates to `Figure.astro`, which delegates to `ImageLink.astro` — a three-level chain for rendering a single `<img>` tag. A developer copying this widget into a new project must bring three files and understand the prop-passing contract between all of them.

Second, `ArticleExcerpt.astro` renders images inline without using `Figure` or `ImageLink` at all. This means the two-level abstraction in `ImageWidget` is not actually DRY — `Figure` and `ImageLink` are only used in one widget, which is the exact case where the abstraction is hardest to justify and most confusing to learn from.

The recommended resolution is to flatten `ImageWidget.astro` to render the image directly, matching the approach used in `ArticleExcerpt.astro`, and retire `Figure.astro` and `ImageLink.astro` from the widget layer. If `Figure` is needed for a page template or layout component that genuinely reuses it, that is a separate case and should be documented as such.

`ArticleExcerpt.astro` also contains a silent data fix (`if (article?.blurb && !article.blurb.options) { ... }`) that patches a missing field on REST API responses. The comment above it is good — it explains the condition. This should be kept as-is and held up as an example of the workaround comment standard from section 2.5.

**Code quality flag — both starters (action required before release):**

The button and link implementations are inconsistent in ways that directly cause editor confusion and violate section 3.2.

`ButtonWidget` — the dedicated standalone button — does not have a `style` field (primary/outline). Its visual appearance is instead controlled via the `styles` module (font size, border radius, color token). `HeroWidget` and `CardWidget` both expose an explicit `style` field with primary/outline choices. `PriceCardWidget` uses the shared `linkConfig` but exposes no style control at all. The result is that an editor who wants a "primary" button must use a widget-embedded link rather than the dedicated button widget — the opposite of what the naming implies.

The fix has two parts. First, add a `style` field (primary/outline, matching the values used in hero and card) to `ButtonWidget` and `PriceCardWidget`. The `styles` module controls on `ButtonWidget` (color token, radius, font size) are additive and can stay, but they should not be the only way to set the button's semantic style. Second, verify that the rendered CSS classes for the `style` field are consistent across all four widgets — if `primary` produces different markup in `ButtonWidget` than in `CardWidget`, that is a separate CSS bug.

Additionally, `HeroWidget` accepts a content area that permits any widget including `ButtonWidget`. An editor who adds a `ButtonWidget` inside a hero's content area alongside the hero's own built-in link buttons will produce an inconsistent and likely broken layout. The area configuration for `HeroWidget`'s content field should exclude `button` from the allowed widgets, since the hero's own link array is the correct mechanism for CTAs within a hero.

---

*Document version: 1.2 · Updated after button consistency review · May 2026*
