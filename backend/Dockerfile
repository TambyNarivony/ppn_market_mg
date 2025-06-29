FROM php:8.2-fpm-alpine

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
    && docker-php-ext-install -j$(nproc) gd pdo_mysql opcache bcmath exif pcntl

COPY --from=composer:latest /usr/bin/composer /usr/local/bin/composer

WORKDIR /var/www/html
COPY . .

RUN composer install --no-dev --optimize-autoloader --no-interaction && \
    php artisan key:generate --show || echo "APP_KEY exists"

# ONLY CLEAR CACHE - NO CACHING IN PRODUCTION UNTIL FIXED
RUN php artisan config:clear && \
    php artisan route:clear && \
    php artisan view:clear

# Test migrations but don't fail build
RUN php artisan migrate --force || echo "Migration failed - check DB connection"

COPY docker/nginx/nginx.conf /etc/nginx/nginx.conf
COPY docker/nginx/conf.d/app.conf /etc/nginx/conf.d/default.conf

RUN nginx -t



RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 775 storage bootstrap/cache

EXPOSE 80
CMD ["sh", "-c", "nginx -g 'daemon off;' & php-fpm"]
