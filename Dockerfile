# ============================================================
#  TU LIBROS YA — Dockerfile de PRODUCCIÓN (multi-stage)
#  Construye la app Next.js con salida "standalone" y la ejecuta
#  con Node en runtime. La base de datos (Postgres en Docker) corre aparte.
# ============================================================

# ---------- Etapa de dependencias ----------
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci

# ---------- Etapa de build ----------
FROM node:20-alpine AS builder
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

# ---------- Etapa de runtime ----------
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

# Copiamos la salida standalone y los assets (public, static).
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

USER nextjs

EXPOSE 3000

ENV NEXT_PRIVATE_STANDALONE=true
CMD ["node", "server.js"]
