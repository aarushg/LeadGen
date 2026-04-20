FROM node:20-alpine AS deps
WORKDIR /app
COPY . ./
RUN npm ci

FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app ./

RUN npx prisma generate
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3001
COPY --from=builder /app ./
EXPOSE 3001
CMD ["npm", "run", "start"]
