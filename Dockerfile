FROM node:8

RUN mkdir -p /app
WORKDIR /app

RUN npm install -g nodemon
COPY package.json /app/package.json
RUN npm install

COPY . /app
EXPOSE 3000

CMD [ "npm", "start" ]