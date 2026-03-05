import { defineConfig } from 'astro/config';
import node from '@astrojs/node';
import apostrophe from '@apostrophecms/apostrophe-astro';
const isStatic = process.env.APOS_BUILD === 'static';

export default defineConfig({
  output: isStatic ? 'static' : 'server',
  // URL path prefix for non-root hosting (e.g. GitHub Pages).
  // Set APOS_PREFIX=/my-repo to enable. No trailing slash.
  base: process.env.APOS_PREFIX || undefined,
  server: {
    port: process.env.PORT ? parseInt(process.env.PORT) : 4321,
    // Required for some hosting, like Heroku
    // host: true
  },
  adapter: isStatic ? undefined : node({ mode: 'standalone' }),
  integrations: [
    apostrophe({
      aposHost: 'http://localhost:3000',
      widgetsMapping: './src/widgets',
      templatesMapping: './src/templates',
      includeResponseHeaders: [
        'content-security-policy',
        'strict-transport-security',
        'x-frame-options',
        'referrer-policy',
        'cache-control'
      ],
      excludeRequestHeaders: [
        // Must exclude this for separate apostrophe and astro hosting to work
        // 'host'
      ]
    })
  ],
  vite: {
    ssr: {
      // Do not externalize the @apostrophecms/apostrophe-astro plugin, we need
      // to be able to use virtual: URLs there
      noExternal: [ '@apostrophecms/apostrophe-astro' ],
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `$base-path: "${process.env.APOS_PREFIX || ''}";`,
          silenceDeprecations: ['legacy-js-api', 'import', 'global-builtin'],
        }
      }
    }
  }
});
