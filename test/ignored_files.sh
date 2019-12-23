#!/bin/bash
test/build.sh
docker run -it -e DEBUG_IMGCMP=1 -e GITHUB_ACTOR=$(git config --global user.name) -e GITHUB_EMAIL=$(git config --global user.email) -e IGNORED_FILES=figs/logo* --name imgcmp 9sako6:imgcmp
test/remove.sh