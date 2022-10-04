FROM node:14

WORKDIR /app

COPY package.json .

RUN npm install
RUN npm install pm2 -g

COPY . .

ENV NODE_PORT=3000
ENV MYSQL_HOST="sql"
ENV MYSQL_USER="root"
ENV MYSQL_PASSWORD="password"
ENV MYSQL_DATABASE="sys"

EXPOSE $NODE_PORT

CMD ["pm2-runtime", "launch-server.js"]