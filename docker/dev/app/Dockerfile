FROM php:8.3-fpm-bookworm

RUN apt-get update
RUN apt-get install -y libonig-dev zlib1g-dev libpng-dev libxml2-dev libzip-dev libmemcached-dev
RUN apt-get install -y default-mysql-client

RUN groupadd -g 1000 hgs && \
    useradd -m -s /bin/bash -u 1000 -g 1000 hgs

# extension
RUN docker-php-ext-install pdo mbstring gd xml zip pdo_mysql
RUN docker-php-source delete

# mongodb
RUN pecl install mongodb && \
    docker-php-ext-enable mongodb

# redis
RUN pecl install redis && \
    docker-php-ext-enable redis

# memcached
RUN pecl install memcached && \
   docker-php-ext-enable memcached

RUN docker-php-source delete

COPY www.conf /usr/local/etc/php-fpm.d/www.conf
COPY php.ini /usr/local/etc/php/php.ini


WORKDIR /var/hgs_re3

RUN kill -USR2 1
USER 1000
