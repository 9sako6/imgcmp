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
    target_dir="${1}"
    github_author="${2}"
    github_email="${3}"
    remote_repo="${4}"
    remote_branch="${5}"
    is_debug=${6}
    # clone repository
    git clone "${remote_repo}" "${target_dir}"
    # make new branch
    cd "${target_dir}"
    git checkout -b "${remote_branch}"
    cd ..
    # run optimizer
    go run $(find / -name imgcmp.go) "${target_dir}"
    if [ ! -e "./pull_request_message.md" ]; then
        exit 0
    fi
    # send pull request
    pull_request_message=`cat ./pull_request_message.md`
    if "${is_debug}"; then
        # check the result
        echo "${pull_request_message}"
    else
        # setting for git
        cd "${target_dir}"
        git config --global user.name "${github_author}"
        git config --global user.email "${github_email}"
        # pull request
        git add .
        git commit -m "Optimize images of ${GITHUB_SHA}"
        git push origin "${remote_branch}"
        hub pull-request -m "${pull_request_message}"
    fi
}


echo "  _                          "
echo " (_)_ __  __ _ __ _ __  _ __ "
echo " | | '  \/ _\` / _| '  \| '_ \\"
echo " |_|_|_|_\__, \__|_|_|_| .__/"
echo "         |___/         |_|   "

# check envs
readonly TARGET_DIR="local_repo"
DEBUG_FLAG=false
if [ -z "${DEBUG_IMGCMP}" ]; then
    if [ -z "${GITHUB_TOKEN}" ]; then
        print_error "not found GITHUB_TOKEN"
        exit 1
    fi
    # production mode
    readonly REMOTE_REPO="https://x-access-token:${GITHUB_TOKEN}@github.com/${GITHUB_REPOSITORY}.git"
    readonly REMOTE_BRANCH="imgcmp-${GITHUB_SHA}"
    readonly GITHUB_EMAIL="${GITHUB_ACTOR}@users.noreply.github.com"
else
    # debug mode on a local machine
    print_info "imgcmp is running on debug mode"
    # set envs
    DEBUG_FLAG=true
    readonly REMOTE_REPO="https://github.com/9sako6/imgcmp.git"
    readonly REMOTE_BRANCH="imgcmp-debug-"`date +'%Y%m%d%H%M%S'`
fi
main_flow "${TARGET_DIR}" "${GITHUB_ACTOR}" "${GITHUB_EMAIL}" "${REMOTE_REPO}" "${REMOTE_BRANCH}" ${DEBUG_FLAG}
