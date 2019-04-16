FROM node

WORKDIR /usr/src/wake-me-up/webserver

COPY . /usr/src/wake-me-up

RUN npm install
  
CMD ["npm", "run", "start"]