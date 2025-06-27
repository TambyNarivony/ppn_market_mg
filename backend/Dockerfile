# ----- Étape 1: Construire l'image PHP avec extensions nécessaires -----
# Utilisez une image PHP officielle avec Apache ou FPM (PHP-FPM est mieux pour Nginx, mais Apache est plus simple ici)
# Pour une image plus petite et optimisée pour la production, on peut utiliser php:8.x-apache-alpine
# Pour plus de flexibilité (Nginx + FPM), on utiliserait php:8.x-fpm-alpine

# Dans cet exemple, nous allons utiliser une image PHP-FPM avec Nginx, car c'est une configuration courante et performante pour Laravel.

# Base image for PHP (change 8.2 to your PHP version if different)
FROM php:8.2-fpm-alpine

# Install system dependencies and PHP extensions
# - curl: for downloading files
# - libpng-dev, libjpeg-turbo-dev: for GD extension (image manipulation)
# - freetype-dev: for GD extension
# - zip, unzip: for composer and archive handling
# - gd: PHP GD extension
# - pdo_mysql: PHP extension for MySQL connection
# - opcache: PHP performance extension
# - bcmath, exif, pcntl: Common Laravel requirements
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
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j$(nproc) gd pdo_mysql opcache bcmath exif pcntl \
    && rm -rf /var/cache/apk/*

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/local/bin/composer

# Set working directory inside the container
WORKDIR /var/www/html

# Copy the Laravel application files into the container
# Use .dockerignore to exclude files not needed in the image (like node_modules, .git)
COPY . .

# Install Composer dependencies
RUN composer install --no-dev --optimize-autoloader --no-interaction

# Generate application key (if not already in .env from Render)
# This command is usually done via env variables on Render, but good to have for initial setup.
# If you rely solely on Render env vars, you might not need this here.
RUN php artisan key:generate --show || echo "APP_KEY already exists or generate on Render."

# Run Laravel optimizations (if in production)
RUN php artisan config:cache \
    && php artisan route:cache \
    && php artisan view:cache

# Configure Nginx for Laravel
# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

RUN ls -la /var/www/html/


# Copy custom nginx configuration
COPY docker/nginx/nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 for Nginx
EXPOSE 80

# Command to run Nginx and PHP-FPM
# This command starts both services in the foreground
CMD ["sh", "-c", "nginx -g 'daemon off;' & php-fpm"]
