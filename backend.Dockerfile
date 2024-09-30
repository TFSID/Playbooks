FROM node:20-alpine

WORKDIR /app

COPY . .

RUN cd backend && \
    npm install

CMD node backend/index.js