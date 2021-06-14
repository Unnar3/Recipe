FROM node:14

WORKDIR /usr/src/recipe

COPY package*.json ./
RUN yarn install

COPY ./jest.config.js ./jest.config.js
COPY ./tsconfig.json ./tsconfig.json
COPY ./recipe-oapi.yml ./recipe-oapi.yml
COPY ./src ./src

RUN yarn oapi
RUN yarn build
RUN yarn test

EXPOSE 8080
CMD [ "node", "./dist/server.js" ]

