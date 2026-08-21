FROM node:20-alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build || true
EXPOSE 5001
CMD ["npx", "ts-node-dev", "--respawn", "--transpile-only", "src/server.ts"]
