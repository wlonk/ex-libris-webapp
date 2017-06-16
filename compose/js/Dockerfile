FROM node:8.1.2

COPY ./package.json /package.json

RUN yarn

WORKDIR /app

CMD ["yarn", "watch"]
