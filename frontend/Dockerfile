# ---- Stage 1: Build React app ----
FROM node:20-alpine AS builder

WORKDIR /app
COPY package.json ./
RUN npm install
COPY . .
RUN npm run build

# ---- Stage 2: Serve with Nginx ----
FROM nginx:alpine

RUN rm -rf /usr/share/nginx/html/*
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx template (automatic substitution happens in /etc/nginx/templates)
COPY nginx.conf /etc/nginx/templates/default.conf.template

EXPOSE 80

# The standard nginx image entrypoint automatically processes templates
CMD ["nginx", "-g", "daemon off;"]
