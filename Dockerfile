FROM node:23-alpine AS base
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@latest --activate
ENV LOG_PATH="./log/pwd.log" \
	STATS_COOKIE_NAME="pwd_stats" \
	WORD_LIST_PATHS="server_static/wordlist.txt" \
	ATTEMPTS_PER_SECOND=6800000000 \
	MAX_ENTROPY_SCALE=128 \
	NODE_ENV="production" \
	DATABASE_URL="file:./db/prod.db"

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN unzip server_static/rockyou.txt.zip -d server_static
RUN mv server_static/rockyou.txt server_static/wordlist.txt
RUN rm server_static/rockyou.txt.zip
RUN pnpm prisma generate --no-hints
RUN pnpm build
RUN pnpm prisma migrate deploy
EXPOSE 3000
