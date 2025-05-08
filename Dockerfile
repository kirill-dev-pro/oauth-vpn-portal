FROM oven/bun

WORKDIR /app

COPY package.json .

RUN bun i

COPY . .

RUN bun run build