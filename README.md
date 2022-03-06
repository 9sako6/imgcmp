<h1 align="center">imgcmp</h1>

<p align="center"><img src="./figs/logo.png" width="50%"></p>

<p align="center">
  <a href="https://github.com/9sako6/imgcmp/actions?CI">
    <img src="https://github.com/9sako6/imgcmp/workflows/CI/badge.svg" alt="ci" />
  </a>
  <a href="https://github.com/marketplace/actions/imgcmp">
    <img src="https://img.shields.io/badge/Marketplace-imgcmp-blue.svg?colorA=24292e&colorB=0366d6&style=flat&longCache=true&logo=github" alt="marketplace" />
  </a>
</p>

This GitHub Actions optimizes images in your repository. You will receive a pull
request with optimized images. This Github Actions is inspired by
[ImgBot](https://github.com/dabutvin/ImgBot).

A pull request example:

<p align="center"><img src="./figs/sample_pull_request.png"></p>

## Usage

```yml
name: imgcmp
on: push
jobs:
  imgcmp:
    if: ${{ startsWith(github.head_ref, 'actions/imgcmp/') != true }}
    runs-on: ubuntu-latest
    steps:
      - uses: 9sako6/imgcmp@v2.0.1
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
```

If you want to run this action only once a week, please add the following lines.

```yml
name: imgcmp
on:
  schedule:
    - cron: "0 0 * * 1" # Weekly build
jobs:
  imgcmp:
    if: ${{ startsWith(github.head_ref, 'actions/imgcmp/') != true }}
    runs-on: ubuntu-latest
    steps:
      - uses: 9sako6/imgcmp@v2.0.1
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
```

Then, you will receive a pull request with optimized images every Monday at
0:00.

## Configuration

### Action inputs

| Name                  | Description                                                                                                                                                                                                                                                                                       | Required |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| `token`               | `GITHUB_TOKEN` or a [Personal access token (PAT)](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token). In a private repository, you have to use PAT with enough permissions. See [How to use a Personal Access Token](./doc/pat.md). | true     |
| `paths-ignore-regexp` | Regular expression for images' paths you don't want to compress.                                                                                                                                                                                                                                  | false    |

#### `paths-ignore-regexp`

imgcmp offers an ignore option. `paths-ignore-regexp` is regular expression for
images' paths you don't want to compress.

Example:

```yml
name: imgcmp
on: push
jobs:
  imgcmp:
    if: ${{ startsWith(github.head_ref, 'actions/imgcmp/') != true }}
    runs-on: ubuntu-latest
    steps:
      - uses: 9sako6/imgcmp@v2.0.1
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
          paths-ignore-regexp: "(ignore/.*)|(public/.*)"
```

## Supported image formats

- [x] JPEG/JPG
- [x] PNG
- [x] GIF
- [x] SVG
- [x] WEBP

## Optimization tools

This bot uses these optimizers.

### [jpegoptim](https://github.com/tjko/jpegoptim)

- `-m85`: this will store the image with 85% quality

### [OptiPNG](http://optipng.sourceforge.net/)

- `-o2`: this sets the optimization level 2 (there is 0-7 optimization levels)

### [Gifsicle](https://www.lcdf.org/gifsicle/)

- `-O3`: this sets the optimization level to Gifsicle's maximum

### [SVGO](https://github.com/svg/svgo)

SVGO's default configuration will be used.

### [cwebp](https://developers.google.com/speed/webp/docs/cwebp)

- `-q 75`: cwebp's default optimization level

## Benchmark

It took 28 sec to create the following PR.

<p align="center"><img src="./figs/actions_time.png"></p>

<p align="center"><img src="./figs/sample_pull_request.png"></p>

## Change Log

### `v2.0.1` (March 6, 2022)

Bug fixes.

- Fix the problem that actions fail when `paths-ignore-regexp` is empty
  (https://github.com/9sako6/imgcmp/pull/51)

### `v2.0.0` (February 6, 2022)

There are breaking changes from version `1.0.1`.

- Use a Personal access token instead of `GITHUB_TOKEN`
  (https://github.com/9sako6/imgcmp/pull/26)
  - `GITHUB_TOKEN` didn't have enough authority in a private repository.
- Add `token` input (https://github.com/9sako6/imgcmp/pull/26)
  - `GITHUB_TOKEN` option in `env` was deleted.
- Add `paths-ignore-regexp` input (https://github.com/9sako6/imgcmp/pull/26)
  - `IGNORED_FILES` option in `env` was deleted.
- Refactoring the pull request template
  (https://github.com/9sako6/imgcmp/pull/26)

## Author

9sako6
