# Stage 1: Build stage
FROM node:18-alpine as builder

WORKDIR /app

COPY package.json package-lock.json* ./

RUN npm install

COPY . .

RUN npm run build

# Stage 2: Production image
FROM node:18-alpine as petfront

WORKDIR /app/petfront

# Copy only built files (e.g., dist or build) from the builder stage
COPY --from=builder /app .

EXPOSE 3600

CMD ["npm", "start"]
