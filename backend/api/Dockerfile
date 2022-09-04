FROM node:alpine

WORKDIR /app

COPY . /app

RUN yarn install && yarn build

ENTRYPOINT node dist/index.js