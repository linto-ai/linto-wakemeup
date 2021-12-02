FROM node:16

WORKDIR /usr/src/wake-me-up

COPY . .

#RUN cd ./vue_app && npm install && npm run build-app
RUN cd ./vue_app && npm install && NODE_OPTIONS=--openssl-legacy-provider && npm run build-app
RUN cd ./webserver && npm install

WORKDIR /usr/src/wake-me-up/webserver

CMD ["npm", "run", "start"]