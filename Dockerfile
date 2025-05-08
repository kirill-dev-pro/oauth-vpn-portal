FROM node:22-alpine

WORKDIR /app

# Install dependencies for better-sqlite3
RUN apk add --no-cache \
    python3 \
    sqlite \
    sqlite-dev \
    make \
    g++

COPY package.json .

RUN npm install 

COPY . .

ENV SKIP_ENV_VALIDATION=true

RUN npm run build

EXPOSE 3000

CMD ["node", ".next/standalone/server.js"]
