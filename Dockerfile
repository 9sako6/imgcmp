FROM golang:latest

RUN apt-get update -qq && apt-get install -y \
    bash \
    gifsicle \
    git \
    jpegoptim \
    optipng

RUN curl -sL https://deb.nodesource.com/setup_12.x | bash -
RUN apt-get install -y nodejs
RUN npm install -g svgo

ADD entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]