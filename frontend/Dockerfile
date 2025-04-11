# Use official Node.js Alpine image for smaller size
FROM node:18-alpine as petfront

# Set working directory
WORKDIR /app/petfront

# Create config directory to allow volume mounting of config.json
RUN mkdir -p /app/petfront/config

# Copy package files and install dependencies
COPY package.json package-lock.json* ./
RUN npm install

# Copy the rest of the source code
COPY . .

# Build the project
RUN npm run build

# Expose the frontend port (change this if your app runs on another port)
EXPOSE 3000

# Start the frontend app
CMD ["npm", "start"]
