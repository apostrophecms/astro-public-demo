# ApostropheCMS + Astro Hybrid Demo

**Learn how to build modern websites with a headless CMS architecture** using ApostropheCMS as your backend and Astro for lightning-fast frontend rendering. This demo shows you the complete integration pattern with working examples you can use immediately.

This repository serves as both a learning resource and starter template for building your own ApostropheCMS + Astro projects.

## Why This Architecture?

This hybrid approach combines:
- **Structured content management** - ApostropheCMS provides an intuitive editing experience with in-context editing
- **Modern frontend performance** - Astro delivers optimal page load speeds with partial hydration
- **Developer flexibility** - Keep backend content modeling separate from frontend presentation
- **Production-ready patterns** - Demonstrates real-world integration including external API calls and blog functionality

**Perfect for:** Development teams evaluating headless CMS options, agencies building client sites, or developers learning modern web architecture patterns.

## What's Included

**Page Types:**
- Home page with customizable areas
- Default content page template
- Article index and show pages with working blog functionality

**Widgets:**
- Core content widgets (rich text, image, video, file)
- Layout widgets (layout, layout column) for structured page composition
- Marketing components (hero, button, card, price card)
- Article widget for content relationships
- GitHub PRs widget demonstrating external API integration

**Additional Features:**
- Component registry pattern for mapping backend modules to frontend templates
- Shared utilities for area configuration and link fields
- Complete development and deployment workflows

## Quick Start

### Prerequisites
- Node.js v24 or later
- A database: SQLite (no server required), MongoDB, or PostgreSQL. Choose SQLite if you're unsure.

### Installation

Create a project with the guided installer:

```bash
npm create apostrophe@latest
```

Answer the prompts as follows. One default installs the demo without content, so check that answer carefully:

1. **Project name** — anything; this becomes the project folder.
2. **How would you like to build?** → **Apostrophe + Astro** (the default).
3. **Choose a starting point** → **Demo**
4. **Pre-fill with sample content?** → **Yes** (the default is No).
5. **Choose a database** → **SQLite**, unless you already run MongoDB or PostgreSQL.
6. **Create your admin account** — pick a username and password.

The installer clones this repository, writes `.env` files for the backend and frontend, installs
dependencies for both, imports the sample content, and creates your admin account. Then:

```bash
cd <your-project-name>
npm run dev
```

Visit `http://localhost:4321` to see the site, and log in at `http://localhost:4321/login` with
the admin account you just created.

To install without prompts, for example in CI, pass `--kit=apostrophe-astro-demo-data`. Without
it, unattended mode installs the demo with no sample content:

```bash
npm create apostrophe@latest -- --unattended --kit=apostrophe-astro-demo-data \
  --project-name=my-site --password=<admin-password> --telemetry=off
```

Run `npm create apostrophe@latest -- --help` for all flags.

### Working on this repository

To contribute to the demo itself, fork the [astro-public-demo](https://github.com/apostrophecms/astro-public-demo/) repo (give it a star while you're there) and clone it directly. This path starts with an empty database and no sample content.

```bash
git clone <your-repo-url>
cd astro-public-demo
npm run install-all
cp backend/.env.example backend/.env
# Edit backend/.env — set APOS_DB_URI unless MongoDB is running locally, e.g.
# APOS_DB_URI=sqlite://./data/astro-public-demo.db
```

Then follow [Development](#development) below, and [create an admin user](#create-an-admin-user).

### Development

Set the environment variables in your terminal:

```bash
export APOS_EXTERNAL_FRONT_KEY=dev
```

> `APOS_ALLOWED_DOMAINS` is not needed for local development — it defaults to `**.apos.dev` for ApostropheCMS hosting. Set it when self-hosting with a custom backend domain (see [Deployment](#deployment)).

Then start both servers:

```bash
npm run dev
```

Or run them separately in two terminals:

```bash
# Terminal 1 - Backend (port 3000)
cd backend && npm run dev

# Terminal 2 - Frontend (port 4321)
cd frontend && npm run dev
```

Visit `http://localhost:4321` to see the site.

### Static Build

Generate a fully static version of the site served from the root path (`/`).

**1. Start the backend:**

```bash
cd backend
npm run dev
```

**2. Build the static frontend** (in a second terminal):

```bash
cd frontend
npm run build:static
```

**3. Preview the build:**

```bash
cd frontend
npm run preview:static
```

Open `http://static.localhost:4000` to see the static version.

For production builds:

```bash
# Terminal 1 - Backend
cd backend
export NODE_ENV=production
APOS_EXTERNAL_FRONT_KEY=dev npm run serve

# Terminal 2 - Frontend
cd frontend
export NODE_ENV=production
npm run build:static
```

> Note: You can change the `APOS_EXTERNAL_FRONT_KEY` value for the `build:static` command.

### Static Build (GitHub Pages)

You can generate a fully static site and deploy it to GitHub Pages (or any static host that serves from a sub-path).

**1. Start the backend** with the prefix and base URL for your GitHub Pages site:

```bash
cd backend
export NODE_ENV=production
export APOS_PREFIX=/<your-repo>
export APOS_STATIC_BASE_URL=https://<your-github-user>.github.io
npm run serve:gh
```

**2. Build the static frontend** (in a second terminal):

```bash
cd frontend
export NODE_ENV=production
export APOS_PREFIX=/<your-repo>
npm run build:gh
```

The output is in `frontend/dist/` and ready to be served from `/<your-repo>/`.

For this repository, the commands are:

```bash
# Terminal 1 - Backend
cd backend
export NODE_ENV=production
export APOS_PREFIX=/astro-public-demo
export APOS_STATIC_BASE_URL=https://apostrophecms.github.io
npm run serve:gh

# Terminal 2 - Frontend
cd frontend
export NODE_ENV=production
export APOS_PREFIX=/astro-public-demo
npm run build:gh
```

**Alternatively, use the deploy script** to build and push to GitHub Pages in one step (the backend must be running as described above):

```bash
./scripts/gh-deploy-static
```

The script auto-detects `<your-github-user>` and `<your-repo>` from the `origin` remote, starts the build, and pushes to the `gh-pages` branch. Run `./scripts/gh-deploy-static --help` for options like `--dry-run` and `--no-build`.

### Create an Admin User

Only needed if you cloned the repository directly. The guided installer creates one for you.

```bash
cd backend
node app @apostrophecms/user:add admin admin
```

## Architecture

```
├── backend/               # ApostropheCMS headless CMS
│   ├── modules/           # Page types, pieces, and widgets
│   ├── lib/               # Shared utilities (area config, link fields)
│   └── app.js             # Main configuration
├── frontend/              # Astro application
│   ├── src/
│   │   ├── pages/         # Single [...slug].astro catch-all route
│   │   ├── templates/     # Page type components
│   │   ├── widgets/       # Widget components
│   │   └── components/    # Reusable Astro components
│   └── astro.config.mjs
└── package.json           # Root scripts for running both projects
```

### How It Works

1. **Backend** (ApostropheCMS) defines content schemas, widgets, and page types
2. **Frontend** (Astro) renders content using mapped components
3. **Bridge** (`@apostrophecms/apostrophe-astro`) connects them, enabling in-context editing

This pattern allows you to maintain a clean separation between content modeling and presentation while still providing editors with a seamless editing experience.

### Component Registries

Templates and widgets are mapped by name in index files:

- `frontend/src/templates/index.js` - Maps page type names to Astro components
- `frontend/src/widgets/index.js` - Maps widget names to Astro components

Keys must match backend module names exactly (e.g., `'default-page'`, `'@apostrophecms/rich-text'`).

## Development Guide

### Adding a New Widget

1. Create the widget module in `backend/modules/{widget-name}/index.js`
2. Register it in `backend/app.js`
3. Create the Astro component in `frontend/src/widgets/{WidgetName}.astro`
4. Add the mapping in `frontend/src/widgets/index.js`

### Adding a New Page Type

1. Create the page module in `backend/modules/{page-name}/index.js`
2. Register it in `backend/app.js` and add to `@apostrophecms/page` types
3. Create the template in `frontend/src/templates/{PageName}.astro`
4. Add the mapping in `frontend/src/templates/index.js`

### Using Areas in Templates

```astro
---
import AposArea from '@apostrophecms/apostrophe-astro/components/AposArea.astro';
const { page } = Astro.props;
---

<AposArea area={page.main} />
```

## Deployment

### ApostropheCMS Hosting (Recommended)

Zero-config deployment with automatic database provisioning, SSL, and asset optimization. [Learn more](https://apostrophecms.com/hosting)

### Self-Hosted

Deploy the backend and frontend separately:

**Backend:** Any Node.js host with MongoDB access (see [hosting docs](https://docs.apostrophecms.org/guide/hosting.html))

**Frontend:** Any SSR-capable host (Netlify, Vercel, Cloudflare Pages, etc.) with these environment variables set:

| Variable | Required | Description |
|---|---|---|
| `APOS_EXTERNAL_FRONT_KEY` | Yes | Shared secret between the Astro frontend and ApostropheCMS backend |
| `APOS_ALLOWED_DOMAINS` | Yes | Comma-separated list of backend hostname patterns Astro is allowed to proxy to. Wildcards are supported (e.g. `mysite.apos.dev`, `**.example.com`, or `api.example.com,**.cdn.example.com`). Defaults to `**.apos.dev`. |

**Important: Production Security Configuration**

Astro requires an `allowedDomains` entry in `astro.config.mjs` for certain
ApostropheCMS operations — including file uploads and logout — to work correctly
in production. Without it, those operations will silently fail with a 403.
This does **not** affect local development.

Add your ApostropheCMS backend domain to the `security` block in
`frontend/astro.config.mjs`:

```js
export default defineConfig({
  // ... other config
  security: {
    allowedDomains: [
      {
        hostname: 'your-apos-backend.com',
        protocol: 'https'
      }
    ]
  }
});
```

This tells Astro to trust `X-Forwarded-Host` headers from your backend, which
it uses to construct the request origin for CSRF validation. Setting
`checkOrigin: false` alone is **not** sufficient.

> Requires `astro@5.14.2` or later. Wildcard hostnames (e.g.
> `*.yourdomain.com`) are supported if your backend and frontend share a domain.

## Production-Ready Starter Kit

This demo focuses on core integration patterns. When you're ready to build a production project, the **[Astro Essentials Starter Kit](https://github.com/apostrophecms/starter-kit-astro-essentials)** provides a minimal foundation you can build your own design system on top of.

Need enterprise features like advanced permissions, automated translation, or document versioning? [Contact us](https://apostrophecms.com/contact-us) to learn about ApostropheCMS Pro.

## Resources

- [ApostropheCMS Documentation](https://docs.apostrophecms.org/)
- [Astro Documentation](https://docs.astro.build/)
- [apostrophe-astro Package](https://github.com/apostrophecms/apostrophe-astro)
- [ApostropheCMS + Astro Tutorial](https://docs.apostrophecms.org/tutorials/astro/apostrophecms-and-astro.html)
- [Discord Community](https://discord.com/invite/HwntQpADJr)

---

*Built by the ApostropheCMS team. [Star us on GitHub](https://github.com/apostrophecms) if this helps your project!*
