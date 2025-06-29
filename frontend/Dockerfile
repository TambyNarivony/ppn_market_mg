# Étape 1 : Construire l'application
FROM node:18-alpine as builder

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Étape 2 : Servir l'application avec Nginx
FROM nginx:alpine

# Copie la config Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copie les fichiers buildés
COPY --from=builder /app/build /usr/share/nginx/html

# Port exposé
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]