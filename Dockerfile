# Stage 1: Build the React app
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
# Use 'npm ci' for faster, more reliable CI builds
RUN npm ci
COPY . .
# This runs the "code build" step
RUN npm run build

# Stage 2: Serve the static files with Nginx
FROM nginx:1.25-alpine
# Copy the built files from Stage 1
COPY --from=build /app/build /usr/share/nginx/html
# Copy our custom Nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]