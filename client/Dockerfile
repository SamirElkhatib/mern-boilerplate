FROM node:13.10.1-alpine3.10
WORKDIR /client
COPY package*.json /client/
RUN yarn
COPY . /client/
CMD ["yarn", "start"]