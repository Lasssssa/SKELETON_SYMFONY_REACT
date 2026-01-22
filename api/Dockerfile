FROM php:8.2-fpm

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpq-dev \
    libzip-dev \
    unzip \
    && docker-php-ext-install pdo pdo_pgsql zip

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www/api

# Copy composer files
COPY composer.* ./

# Install PHP dependencies
RUN composer install --no-scripts --no-autoloader --prefer-dist

# Copy application files
COPY . .

# Generate autoloader and run post-install scripts
RUN composer dump-autoload --optimize && \
    php bin/console cache:clear --no-interaction || true

# Set permissions
RUN chown -R www-data:www-data /var/www/api

# Expose port 9000 for PHP-FPM
EXPOSE 9000

CMD ["php-fpm"]
