
FROM node:18-alpine


WORKDIR /app


COPY package.json package-lock.json* ./


RUN npm ci

COPY prisma ./prisma


RUN npx prisma generate


COPY . .


RUN npm run build


EXPOSE 3000


CMD ["npm", "start"]