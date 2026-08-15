FROM node:20-alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build || true # Just in case we need a build step later, currently using ts-node-dev in dev, but for docker we might run tsc if needed

EXPOSE 5000

CMD ["npx", "tsx", "watch", "src/server.ts"]
