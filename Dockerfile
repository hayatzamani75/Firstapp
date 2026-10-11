# Base PHP image with Composer
FROM php:8.2-fpm

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git curl libpng-dev libonig-dev libxml2-dev zip unzip \
    sqlite3 libsqlite3-dev \
    && docker-php-ext-install pdo pdo_mysql pdo_sqlite mbstring exif pcntl bcmath gd

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www

# Copy existing application directory contents
COPY . .

# Install PHP dependencies
RUN composer install --optimize-autoloader --no-dev

# Set correct permissions
RUN chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache

# Install Node.js and build assets
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs && \
    rm -rf node_modules package-lock.json && \
    npm install && npm rebuild && npm run build

# Laravel setup
RUN cp .env.example .env && \
    php artisan key:generate && \
    php artisan migrate --force

# Expose port
EXPOSE 8000

# Start Laravel app
CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]
