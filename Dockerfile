# Serves the folder mounted at /srv on port 3000; mount a listr.config.json at
# /app/listr.config.json to configure it (see DESIGN.md, Docker)
FROM node:24-alpine AS build
WORKDIR /app
RUN corepack enable
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm build && pnpm prune --prod

FROM node:24-alpine
WORKDIR /app
ENV NODE_ENV=production LISTR_ROOT=/srv
COPY --from=build /app/package.json ./
COPY --from=build /app/node_modules node_modules
COPY --from=build /app/build build
USER node
EXPOSE 3000
CMD ["node", "build"]
