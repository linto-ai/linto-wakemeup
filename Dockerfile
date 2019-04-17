FROM node

WORKDIR /usr/src/wake-me-up

COPY . .
COPY ./.docker_env /usr/src/wake-me-up/vue_app/.env

RUN cd ./vue_app && npm install && npm run build-app 
RUN cd ./webserver && npm install

WORKDIR /usr/src/wake-me-up/webserver

CMD ["npm", "run", "start"]