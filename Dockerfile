FROM node:18-alpine

# Install ping (optional for testing DB inside container)
RUN apk update && apk add iputils

# Set working directory
WORKDIR /app

# Copy and install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Expose port
EXPOSE 3000

# Start the app
CMD ["npm", "start"]
