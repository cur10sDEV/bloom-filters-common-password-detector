FROM node:lts-alpine AS base

# USER node

WORKDIR /usr/src/app

# RUN chown -R node:node /usr/src/app

COPY package*.json .

RUN npm ci

COPY . .

CMD [ "npm", "run", "dev" ]