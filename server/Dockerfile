FROM node:13.10.1-alpine3.10
WORKDIR /server
COPY package*.json /server/
RUN yarn
COPY . /server/
CMD ["yarn", "dev"]