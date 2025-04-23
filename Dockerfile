# Stage 1: build the React/Vite app
FROM node:20-alpine AS builder
WORKDIR /app

# 1) Copy only manifests + config so install is fast
COPY package.json package-lock.json tsconfig.json vite.config.ts ./

# 2) Install deps but skip scripts (so we don’t try to build before source exists)
RUN npm ci --ignore-scripts

# 3) Copy in your full source tree
COPY . .

# 4) Run the build now that src/, tsconfig.json, etc. are present
ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}
RUN npm run build

# Stage 2: serve with nginx
FROM nginx:stable-alpine
RUN rm -rf /usr/share/nginx/html/*
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]