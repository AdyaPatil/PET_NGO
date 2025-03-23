FROM node:18-alpine as petfront

WORKDIR /app/petfront

COPY package.json package-lock.json* /app/petfront

RUN npm install 

RUN npm i

COPY . /app/petfront

RUN npm run build

EXPOSE 3600

CMD ["npm", "start"] 