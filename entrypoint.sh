#!/bin/bash

set -e

# utils
function print_error() {
    echo -e "\e[31mERROR: ${1}\e[m"
}

echo "imgcmp:"

# check envs
if [ -z "${GITHUB_TOKEN}" ]; then
    print_error "not found GITHUB_TOKEN"
    exit 1
fi

# install hub & imgcmp
go get github.com/github/hub
go get github.com/9sako6/imgcmp

# setting for git
git config --global user.name "${GITHUB_ACTOR}"
git config --global user.email "${GITHUB_ACTOR}@users.noreply.github.com"
REMOTE_REPO="https://x-access-token:${GITHUB_TOKEN}@github.com/${GITHUB_REPOSITORY}.git"
export REMOTE_BRANCH="imgcmp-${GITHUB_SHA}"

# clone & checkout new branch
git clone "${REMOTE_REPO}" local_repo
cd local_repo
git checkout -b "${REMOTE_BRANCH}"

# main flow
echo ${IGNORED_FILES}
echo "---"
imgcmp

