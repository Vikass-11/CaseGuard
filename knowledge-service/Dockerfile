FROM node:20-alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build || true
CMD ["npx", "ts-node-dev", "--respawn", "--transpile-only", "src/server.ts"]
