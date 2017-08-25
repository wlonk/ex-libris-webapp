FROM node:8.1

WORKDIR /app

RUN yarn

ENV PATH="/app/node_modules/.bin:${PATH}"

CMD ["yarn", "watch"]
