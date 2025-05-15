# Base stage
FROM node:slim AS base
WORKDIR /app

# Install Angular CLI & Create a non-root user
RUN npm install -g @angular/cli && useradd -ms /bin/bash appuser

# Copy package.json and package-lock.json
# This is done separately to leverage Docker's caching mechanism
# so that we don't have to reinstall dependencies if only application code changes
COPY package*.json ./
# Install dependencies
# Use --no-cache to avoid caching the npm layers
RUN npm install --no-cache

# Copy the rest of the application files
COPY . .


# Development stage
FROM base AS dev
EXPOSE 4200
CMD ["ng", "serve"]

# Production build stage
FROM base AS build
WORKDIR /app

# Adjust permissions for the new user
RUN chown -R appuser:appuser /app
# Switch to non-root user
USER appuser

RUN ng build --output-path=dist

# Production stage
# Use a lightweight web server to serve the static files
# Use nginx to serve the static files
# Use a specific version of nginx for better reproducibility
FROM nginx:1.28.0-alpine-slim
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
