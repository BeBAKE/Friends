FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install typescript
RUN npm ci --only=production

COPY . .

RUN npm run build

EXPOSE 5500

CMD [ "node", "dist/index.js" ]