#!/bin/bash

# Exit on error
set -e

# Install Composer
curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Laravel backend setup
composer install --optimize-autoloader --no-dev
php artisan key:generate
php artisan migrate --force

# Frontend setup
npm install
npm run build
