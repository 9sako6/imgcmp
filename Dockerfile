FROM golang:latest

LABEL "com.github.actions.name"="imgcmp"
LABEL "com.github.actions.description"="Optimize images"
LABEL "com.github.actions.icon"="image"
LABEL "com.github.actions.color"="purple"
LABEL "repository"="http://github.com/9sako6/imgcmp"
LABEL "homepage"="http://github.com/9sako6/imgcmp"
LABEL "maintainer"="9sako6"

RUN apt-get update && apt-get install -y \
    bash \
    gifsicle \
    git \
    jpegoptim \
    optipng

ADD entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]