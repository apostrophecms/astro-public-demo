// Both values come from the environment. Never hard-code them here.
// Generate a value with any secure generator, e.g. `openssl rand -hex 32`.
const apiKey = process.env.APOS_API_KEY;
const sessionSecret = process.env.APOS_SESSION_SECRET;

export default {
  options: {
    // So baseUrl can be autodetected when behind nginx
    trustProxy: true,
    session: {
      // Dev-only fallback; production requires APOS_SESSION_SECRET
      secret: sessionSecret || 'dev-only-insecure-secret'
    },
    // Optional. Only set APOS_API_KEY if you need a REST API key, and note
    // that it has full admin access.
    apiKeys: apiKey
      ? {
        [apiKey]: {
          role: 'admin'
        }
      }
      : {}
  },
  init(self) {
    // Refuse to start a production server without a real secret. Command
    // line tasks such as the asset build and migrations don't use sessions,
    // so they still run in build environments that lack runtime secrets.
    if (
      process.env.NODE_ENV === 'production' &&
      !sessionSecret &&
      !self.apos.isTask()
    ) {
      throw new Error('APOS_SESSION_SECRET must be set in production');
    }
  }
};
