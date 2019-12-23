#!/bin/bash
test/build.sh
docker run -it -e DEBUG_IMGCMP=1 -e GITHUB_ACTOR=$(git config --global user.name) -e GITHUB_EMAIL=$(git config --global user.email) --name imgcmp 9sako6:imgcmp
test/remove.sh