# Étape 1 : Construire l'application
FROM node:18-alpine as builder

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --silent
COPY . .
RUN npm run build

RUN ls -l dist/


# Vérification du dossier de build
RUN ls -l . && \
    echo "Contenu du dossier build:" && \
    ls -l build/  # Ou dist/ si tu utilises Vite

# Étape 2 : Servir l'application
FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf

# Utilise le même nom que dans la vérification ci-dessus
COPY --from=builder /app/dist /usr/share/nginx/html  # Changé à dist

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]