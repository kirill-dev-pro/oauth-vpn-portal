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

EXPOSE 3000

CMD ["npm", "run", "start:docker"]
