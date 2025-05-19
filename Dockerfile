# Stage 1: Build Frontend (nms_optimizer-web)
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend

# Copy frontend specific files from nms_optimizer-web directory (relative to build context)
COPY package.json \
     package-lock.json \
     tsconfig.json \
     vite.config.ts \
     ./
RUN npm ci --ignore-scripts

# Copy the rest of the frontend source
COPY . ./
RUN npm run build:docker # Assumes output to /app/frontend/dist

# Stage 2: Prepare Backend (nms_optimizer-service from GitHub)
FROM python:3.11-slim AS backend-builder
WORKDIR /app/backend

# Install git and any build dependencies for python packages
RUN apt-get update && apt-get install -y --no-install-recommends \
    git \
    build-essential \
    # Add other build dependencies if your requirements.txt needs them (e.g., libpq-dev for psycopg2)
    && rm -rf /var/lib/apt/lists/*

# Clone the backend repository
ARG BACKEND_REPO_URL=https://github.com/jbelew/nms_optimizer-service.git
ARG BACKEND_REPO_BRANCH=main # Or a specific commit/tag
RUN git clone --branch ${BACKEND_REPO_BRANCH} --depth 1 ${BACKEND_REPO_URL} .

# Install Python dependencies from the cloned repo's requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Stage 3: Final Image with Nginx, Frontend, and Backend Service
FROM python:3.11-slim

LABEL maintainer="jbelew.dev@gmail.com"
LABEL description="NMS Optimizer Web UI and Python Backend Service"

ENV PYTHONUNBUFFERED=1 \
    APP_USER=appuser \
    APP_GROUP=appgroup

# Create a non-root user for running the application
RUN groupadd -r ${APP_GROUP} && useradd -r -g ${APP_GROUP} -d /opt/app -s /sbin/nologin ${APP_USER}

# Install Nginx, supervisor, and Gunicorn
RUN apt-get update && apt-get install -y --no-install-recommends \
    nginx \
    supervisor \
    && pip install --no-cache-dir gunicorn \
    && apt-get purge -y --auto-remove -o APT::AutoRemove::RecommendsImportant=false \
    && rm -rf /var/lib/apt/lists/*

# Create necessary directories and set permissions
RUN mkdir -p /opt/app/frontend_dist \
               /opt/app/backend_app \
               /var/log/supervisor \
               /var/log/nginx \
               /run/nginx \
               /var/run/supervisor && \
    chown -R ${APP_USER}:${APP_GROUP} /opt/app && \
    # Nginx runs as www-data on Debian for these paths
    chown -R www-data:www-data /var/log/nginx /run/nginx && \
    chmod 755 /run/nginx && \
    chown root:root /var/run/supervisor # Supervisor pid file

WORKDIR /opt/app

# Copy built frontend from frontend-builder stage
COPY --from=frontend-builder --chown=${APP_USER}:${APP_GROUP} /app/frontend/dist /opt/app/frontend_dist

# Copy backend application from backend-builder stage
COPY --from=backend-builder --chown=${APP_USER}:${APP_GROUP} /app/backend /opt/app/backend_app

# Install Python dependencies for the backend application in the final stage
WORKDIR /opt/app/backend_app
RUN pip install --no-cache-dir -r requirements.txt
WORKDIR /opt/app # Reset WORKDIR to the main app directory

# Copy Nginx site configuration (assumes docker_configs directory is at the root of the build context)
COPY docker_configs/app.nginx.conf /etc/nginx/conf.d/default.conf
# Ensure any default site from sites-enabled is removed to avoid conflicts if Nginx package installed one
RUN rm -f /etc/nginx/sites-enabled/default

# Copy Supervisor configuration
COPY docker_configs/supervisord.conf /etc/supervisor/supervisord.conf

EXPOSE 80
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/supervisord.conf"]
