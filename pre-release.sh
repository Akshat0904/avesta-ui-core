#!/bin/sh

# Get the current branch name
BRANCH=$(git rev-parse --abbrev-ref HEAD)

# Check if the current branch is main or a pre-release branch
if [ "$BRANCH" = "main" ] || [ "${BRANCH#pre-release}" != "$BRANCH" ]; then
    echo Current branch is $BRANCH, proceeding with release
    # Check git status is clean
    if [ -z "$(git status --porcelain)" ]; then
        echo Git working directory clean.
    else
        echo Error: ensure all git changes are committed and git status output is clean
        exit 1
    fi

    # Pull latest tags/changes without merging them locally
    git fetch
    HEADHASH=$(git rev-parse HEAD)
    UPSTREAMHASH=$(git rev-parse origin/$BRANCH)

    # Check if latest changes are pulled and merged locally
    if [ "$HEADHASH" != "$UPSTREAMHASH" ]; then
        echo ERROR: Not up to date with origin. Aborting.
        exit 1
    else
        echo Current branch is up to date with origin/$BRANCH.
    fi

    # Check if typescript compilation is okay
    echo Checking typescript compilation...
    npm run typecheck
    if [ $? -eq 0 ]; then
        echo Typecheck is okay.
    else
        echo Error: Typescript compilation failed. Please fix and retry.
        exit 1
    fi

    # Run tests
    # echo Running unit tests
    # npm run test
    # if [ $? -eq 0 ]; then
    #     echo All tests pass. All good to release.
    #     exit 0
    # else
    #     echo Error: Tests failed. Please fix and retry.
    #     exit 1
    # fi
else
    echo Error: To release, please use the main branch or a  branch with pre-release as prefix ; 
    exit 1
fi
