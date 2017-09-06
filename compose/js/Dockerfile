FROM node:8.1

ENV PATH="/app/node_modules/.bin:${PATH}"

WORKDIR /app

RUN yarn install --force

CMD ["yarn", "watch"]
