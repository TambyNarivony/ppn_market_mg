# Base image PHP-FPM
FROM php:8.2-fpm-alpine

# Install dependencies
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

# Setup working directory
WORKDIR /var/www/html

# Copy application
COPY . .

# Install dependencies and optimize
RUN composer install --no-dev --optimize-autoloader --no-interaction && \
    php artisan key:generate --show || echo "APP_KEY exists" && \
    php artisan config:cache && \
    php artisan route:cache && \
    php artisan view:cache

# Configure Nginx
COPY docker/nginx/nginx.conf /etc/nginx/nginx.conf
COPY docker/nginx/app.conf /etc/nginx/conf.d/default.conf

# Test Nginx config
RUN nginx -t

# Permissions
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

# Expose and run
EXPOSE 80
CMD ["sh", "-c", "nginx -g 'daemon off;' & php-fpm"]
