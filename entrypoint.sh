#!/bin/bash

set -e

# utils
function print_error() {
    echo -e "\e[31mERROR: ${1}\e[m"
}

function print_info() {
    echo -e "\e[34mINFO: ${1}\e[m"
}

function main_flow() {
    # $1: target directory's path of imgcmp
    # $2: user.name
    # $3: user.email
    # $4: remote repository name
    # $5: branch name
    # $6: debug mode or not (boolean)
    TARGET_DIR="${1}"
    GITHUB_ACTOR="${2}"
    GITHUB_EMAIL="${3}"
    REMOTE_REPO="${4}"
    REMOTE_BRANCH="${5}"
    is_debug="${6}"
    # clone repository for debug
    git clone "${REMOTE_REPO}" "${TARGET_DIR}"
    # make new branch
    cd "${TARGET_DIR}"
    git checkout -b "${REMOTE_BRANCH}"
    cd ..
    # main flow
    go run main.go "${TARGET_DIR}"
    pull_request_message=`cat ./pull_request_message.md`
    if "${is_debug}"; then
        # check the result
        echo "${pull_request_message}"
    fi
    # setting for git
    cd "${TARGET_DIR}"
    git config --global user.name "${GITHUB_ACTOR}"
    git config --global user.email "${GITHUB_EMAIL}"
    # pull request
    git add .
    git commit -m "Optimize images of ${GITHUB_SHA}"
    git push origin "${REMOTE_BRANCH}"
    hub pull-request -m "${pull_request_message}"
}


echo "  _                          "
echo " (_)_ __  __ _ __ _ __  _ __ "
echo " | | '  \/ _\` / _| '  \| '_ \\"
echo " |_|_|_|_\__, \__|_|_|_| .__/"
echo "         |___/         |_|   "

echo "/:"
ls /

echo "/home:"
ls /home

echo "..:"
ls ..

echo ".:"
ls .

echo "../workspace:"
ls ../workspace

echo "../workflow:"
ls ../workflow

echo "/github:"
ls /github

find / -name imgcmp.go

# check envs
if [ -z "${DEBUG_IMGCMP}" ]; then
    if [ -z "${GITHUB_TOKEN}" ]; then
        print_error "not found GITHUB_TOKEN"
        exit 1
    fi
    # production mode
    TARGET_DIR="./local_repo"
    REMOTE_REPO="https://x-access-token:${GITHUB_TOKEN}@github.com/${GITHUB_REPOSITORY}.git"
    REMOTE_BRANCH="imgcmp-${GITHUB_SHA}"
    GITHUB_EMAIL="${GITHUB_ACTOR}@users.noreply.github.com"
    main_flow "${TARGET_DIR}" "${GITHUB_ACTOR}" "${GITHUB_EMAIL}" "${REMOTE_REPO}" "${REMOTE_BRANCH}" false
else
    # debug mode on a local machine
    print_info "imgcmp is running on debug mode"
    # set envs
    TARGET_DIR="./local_repo"
    REMOTE_REPO="https://github.com/9sako6/imgcmp.git"
    REMOTE_BRANCH="imgcmp-debug-"`date +'%Y%m%d%H%M%S'`
    main_flow "${TARGET_DIR}" "${GITHUB_ACTOR}" "${GITHUB_EMAIL}" "${REMOTE_REPO}" "${REMOTE_BRANCH}" true
fi

