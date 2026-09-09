FROM node:20-alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build || true
EXPOSE 5003
CMD ["npm", "start"]
