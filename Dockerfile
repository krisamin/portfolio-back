FROM node:18-alpine

RUN apk add tzdata && ln -snf /usr/share/zoneinfo/Asia/Seoul /etc/localtime

WORKDIR /app

COPY ./package.json ./yarn.lock ./

RUN yarn install

COPY . .

RUN yarn build

CMD [ "yarn", "start:prod" ]

LABEL org.opencontainers.image.source=https://github.com/krisamin/portfolio-back