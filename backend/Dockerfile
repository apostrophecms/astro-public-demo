# Production image for the ApostropheCMS backend.
# The Astro frontend is built and deployed separately.
FROM node:24-slim

WORKDIR /app

# Install dependencies first so this layer is cached between code changes
COPY package*.json ./
RUN npm install --omit=dev

COPY . .

# Build admin UI and frontend assets. The release-id file ties the build to
# this image, so the running server serves the assets built here.
ENV NODE_ENV=production
RUN date +%s > release-id && npm run build

# SQLite databases and local uploads. Use a database server and cloud
# storage (uploadfs) instead when running more than one container.
VOLUME /app/data
VOLUME /app/public/uploads

EXPOSE 3000

# Run pending migrations, then start the server
CMD [ "sh", "-c", "npm run migrate && npm run serve" ]
