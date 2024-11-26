FROM php:8.3-fpm

# ARG values for creating a non-root user
ARG user
ARG uid

# Install required dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    default-mysql-client && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Install PHP extensions
RUN docker-php-ext-install \
    pdo_mysql \
    mbstring \
    exif \
    pcntl \
    bcmath \
    gd

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Create a non-root user
RUN useradd -u $uid -ms /bin/bash -g www-data $user

# Set working directory and adjust permissions
WORKDIR /var/www
COPY . /var/www
RUN chown -R $user:www-data /var/www

# Switch to the non-root user
USER $user

# Expose PHP-FPM port
EXPOSE 9000

# Set the default command to run PHP-FPM
CMD ["php-fpm"]
