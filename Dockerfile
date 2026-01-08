# Use Node.js 18 Alpine as base image
FROM node:18-alpine

# Install bun
RUN npm install -g bun

# Set working directory
WORKDIR /app

# Allow build-time override of the Vite API URL (default to Render URL)
ARG VITE_API_URL=https://diabetis-prediction-api-1.onrender.com
ENV VITE_API_URL=$VITE_API_URL

# Copy package files
COPY package*.json bun.lockb ./

# Install dependencies
RUN bun install --frozen-lockfile

# Copy source code
COPY . .

# Build the application
RUN bun run build

# Use nginx to serve the built application
FROM nginx:alpine

# Copy built application from previous stage
COPY --from=0 /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]