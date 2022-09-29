FROM node:14

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

ENV NODE_PORT 3000
ENV MYSQL_HOST "sql"
ENV MYSQL_USER "root"
ENV MYSQL_PASSWORD "password"
ENV MYSQL_DATABASE "sys"

EXPOSE $NODE_PORT

CMD ["npm", "start"]