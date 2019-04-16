FROM node

WORKDIR /usr/src/wake-me-up/webserver

COPY . /usr/src/wake-me-up

RUN npm install 
RUN cd ../vue_app && npm run build
  
CMD ["npm", "run", "start"]