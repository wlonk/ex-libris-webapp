FROM node:8.1.2

COPY ./client/package.json /package.json

RUN yarn

WORKDIR /app

CMD ["yarn", "watch"]
