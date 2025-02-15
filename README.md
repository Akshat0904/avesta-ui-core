# avesta-ui-core

This repository contains business logic that is common to multiple UI impelmentations that implement features available on view.com.au. This codebases uses concepts from Clean Architecture and applies layered architecture fundamentals to achieve its purposes.

Currently the only dependecy this code has is on React as all current target presentation layers (website and native mobile apps) use React. This may change in future.

## Release workflow

-   Before you are ready for a release make sure to check following things
    1. You are in main branch
    2. Typescript compilation is not failing
-   Run command `npm run release`. It will perform below tasks
    1. Retrieve the current version of your repository by looking at package.json, falling back to the last git tag.
    2. Generates a changelog based on your commits (uses [conventional-changelog](https://github.com/conventional-changelog/conventional-changelog) under the hood) and updates CHANGELOG.md
    3. Creates a new commit including your package.json and updated CHANGELOG.
    4. Creates a new tag with the new version number.
-   Run command `ggpush` or `git push` to push the new commit to github
-   Run command `git push --tags` for pushing the newly generated tag to github
-   Above step will trigger a github action workflow which will create a github release and publish the new version of package to github package repository.
-   If github action workflow is successfull (status can be checked [from here](https://github.com/realestateview/avesta-ui-core/actions)) then release is complete.

## Commit message conventions

This project follows [Conventional commit guidelines](https://www.conventionalcommits.org/en/v1.0.0/). Commit messages are important because the changelog is prepared based on the commit messages and the message is validated before commiting using commitlint.

## Usage instructions 

### Running locally (used for bleeding edge releases)

1. Clone this repo locally and checkout master branch
2. Run `npm i` to install dependencies
3. Run `npm build` to compile ts code into js
4. Run `npm pack` to prepare a .tar file of the build code. This file will be placed in the root directory(parallel to this file) and will be in format of `realestateview-avesta-ui-core-x.x.x.tgz`
5. Go into your project and install @realestateview/avesta-ui-core package using folder generated in previous step by running following command
   `npm i <path to realestateview-avesta-ui-core-x.x.x.tgz>`
6. Done.
   
Note
-   Everytime there is any change in package, you need to repeat step 3 to 5 to have access to new code.


### Consuming directly from github packages (used for  stable releases)
As this package is hosted by Github and not by npm hence it is not available like other packages from the npm registry. We need to tell npm cli to use the Github registry when trying to install this package. To do that there must be a `.npmrc` file in same level as package.json with following contents OR you can make changes to global .npmrc directory at your OS user level.

```
@realestateview:registry=https://npm.pkg.github.com/
//npm.pkg.github.com/:_authToken=<token>
```

To use stable release in your project run following command
```
npm i @realestateview/avesta-ui-core --save
```

## Pre-release

If you need to make changes to this repo and make publish it to github package repository (so that is is consumable via npm) but do not want to make it available to all projects (since they are not ready for production) then you can publish a special version called as [pre-release](https://github.com/conventional-changelog/standard-version?tab=readme-ov-file#release-as-a-pre-release).

### How to create a pre-release version

-   Before you are ready for a release make sure to check following things
    1. You are in your feature branch
    2. Typescript compilation is not failing
-   Run command `npm run release -- --prerelease`. It will perform below tasks
    1. Retrieve the current version of your repository by looking at package.json, falling back to the last git tag.
    2. Generates a changelog based on your commits (uses [conventional-changelog](https://github.com/conventional-changelog/conventional-changelog) under the hood) and updates CHANGELOG.md
    3. Creates a new commit including your package.json and updated CHANGELOG.
    4. Creates a new tag with the new version number.
-   Run command `ggpush` or `git push` to push the new commit to github
-   Run command `git push --tags` for pushing the newly generated tag to github
-   Above step will trigger a github action workflow which will create a github release and publish the new version of package to github package repository. Tag name will be of format `next-x.x.x-x`
-   If github action workflow is successfull (status can be checked [from here](https://github.com/realestateview/avesta-ui-core/actions)) then release is complete.

### How to promote pre-release version to release

-   If you are on your feature branch then merge your code to main
-   On main follow the steps for normal stable release given [above](https://github.com/realestateview/avesta-ui-core?tab=readme-ov-file#release-workflow)

### Tips

-   Packages published as pre-release are not automatically updated by npm (does not matter if you use ~ or ^ in package.json)
-   To use the pre-release version in any project, go into that project and run `npm i @realestateview/avesta-ui-core@next-<pre-release-version>`
-   Use your feature branch and **not the `main`** branch when making pre-releases as your code is not ready for production and someone else wanting to make a release on main branch will not be able to do if unstable changes live on main.
