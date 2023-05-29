FROM node:18-alpine

MAINTAINER Node Project

RUN mkdir /app

COPY backend/package.json /app

WORKDIR /app

RUN npm install --production