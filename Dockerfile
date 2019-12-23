FROM golang:latest

RUN set -ex

RUN apt-get update -qq && apt-get install -y \
    bash \
    file \
    gifsicle \
    git \
    jpegoptim \
    optipng

RUN curl -sL https://deb.nodesource.com/setup_12.x | bash -
RUN apt-get install -y nodejs
RUN npm install -g svgo
RUN go get github.com/github/hub
COPY main.go .
RUN ls

ADD entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]