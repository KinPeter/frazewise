FROM node:22.5.1-alpine

WORKDIR /app

COPY ../../api.package.json ./package.json
COPY ../../tsconfig.json ./tsconfig.json
COPY ../../api ./api
COPY ../../common ./common

RUN npm install

EXPOSE 5200

CMD ["npm", "run", "start:api"]