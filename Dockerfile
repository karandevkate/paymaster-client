# Stage 1: Builder
FROM node:20-alpine AS builder

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json first
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application source code
COPY . .

# Build the application
# ARG VITE_API_BASE_URL is passed during the docker build command
# The default (if no arg is passed) should be the relative path
ARG VITE_API_BASE_URL=/api
RUN npm run build

# Stage 2: Production Runtime
# Use a lightweight NGINX image to serve the static assets
FROM nginx:alpine

# Remove default NGINX configuration
RUN rm /etc/nginx/conf.d/default.conf

# Copy the custom NGINX configuration (which includes all the necessary routing fixes)
COPY nginx.conf /etc/nginx/conf.d/paymaster.conf

# Copy the built application files from the builder stage into NGINX's web root
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose the port NGINX is listening on (default 80)
EXPOSE 80

# The default command runs NGINX
CMD ["nginx", "-g", "daemon off;"]