# Base image PHP-FPM avec Alpine
FROM php:8.2-fpm-alpine

# Installer les dépendances système
RUN apk add --no-cache \
    nginx \
    curl \
    libpng-dev \
    libjpeg-turbo-dev \
    freetype-dev \
    zip \
    unzip \
    nodejs \
    npm \
    openssl 
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j$(nproc) gd pdo_mysql opcache bcmath exif pcntl

# Installer Composer
COPY --from=composer:latest /usr/bin/composer /usr/local/bin/composer

# Créer le dossier pour les certificats SSL
RUN mkdir -p /var/www/html/storage/certs

# Copier l'application et le certificat SSL
COPY . /var/www/html/
COPY --chown=www-data:www-data storage/certs/isrgrootx1.pem /var/www/html/storage/certs/

# Définir le répertoire de travail
WORKDIR /var/www/html

# Installer les dépendances et optimiser
RUN composer install --no-dev --optimize-autoloader --no-interaction

# Vérifier la présence du certificat SSL
RUN test -f /var/www/html/storage/certs/isrgrootx1.pem && \
    echo "SSL certificate found" || echo "SSL certificate MISSING"

# Configurer les permissions
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 775 storage bootstrap/cache \
    && chmod 644 storage/certs/isrgrootx1.pem

# Nettoyer le cache
RUN php artisan config:clear \
    && php artisan route:clear \
    && php artisan view:clear

# Configurer Nginx
COPY docker/nginx/nginx.conf /etc/nginx/nginx.conf
COPY docker/nginx/conf.d/app.conf /etc/nginx/conf.d/default.conf

# Tester la configuration Nginx
RUN nginx -t

# Script de test de connexion DB (optionnel)
RUN echo "<?php \
    try { \
        \$pdo = new PDO('mysql:host=' . getenv('DB_HOST') . ';port=' . getenv('DB_PORT'), getenv('DB_USERNAME'), getenv('DB_PASSWORD'), [ \
            PDO::MYSQL_ATTR_SSL_CA => getenv('DB_SSL_CA'), \
            PDO::MYSQL_ATTR_SSL_VERIFY_SERVER_CERT => true \
        ]); \
        echo 'Database connection OK!'; \
    } catch (\PDOException \$e) { \
        echo 'Database connection failed: ' . \$e->getMessage(); \
    } \
    " > /var/www/html/public/test-db.php

# Exposer le port 80
EXPOSE 80

# Commande de démarrage
CMD ["sh", "-c", "nginx -g 'daemon off;' & php-fpm"]
