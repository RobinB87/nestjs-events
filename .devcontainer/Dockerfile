FROM node:21-alpine3.18

RUN apk update && apk add git

RUN npm install -g @nestjs/cli

USER node

WORKDIR /app