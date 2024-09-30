FROM node:20-alpine

WORKDIR /app

COPY . .

CMD cd frontend && \
    npm install && \
    npm start