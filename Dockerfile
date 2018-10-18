FROM node:8-alpine

WORKDIR /src

COPY package.json yarn.lock ./
RUN yarn

COPY . /src

EXPOSE 8005
CMD ["yarn", "start"]
