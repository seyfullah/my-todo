# Use official Node.js LTS image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the app
COPY . .

# Copy todos.json file
COPY todos.json ./

# Build the Next.js app
RUN npm run build

# Expose port
EXPOSE 3000

# Start the Next.js production server
CMD ["npm", "start"]