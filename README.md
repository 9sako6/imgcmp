# imgcmp

<p align="center"><img src="./figs/logo.png" width="50%"></p>

This [GitHub action](https://github.com/features/actions) optimizes images in your repository.
After your `git push`, you will receive a pull request with optimized images.
This Github action is inspired by [ImgBot](https://github.com/dabutvin/ImgBot).

The pull request example:
<p align="center"><img src="./figs/sample_pull_request.png" width="80%"></p>

## Usage
To use the GitHub acion add the following lines to your `.github/workflows/imgcmp.yml`:

```yml
name: imgcmp
on: push
jobs:
  build:
    name: imgcmp
    runs-on: ubuntu-latest    
    steps:
    - uses: 9sako6/imgcmp@master
      env:
        GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

## Supported image formats
- [x] JPEG/JPG
- [x] PNG
- [x] GIF
- [ ] SVG


## Optimization tools
This bot uses these optimizers.

### [jpegoptim](https://github.com/tjko/jpegoptim)
- `-m85`: this will store the image with 85% quality

### [OptiPNG](http://optipng.sourceforge.net/)
- `-o2`: this sets the optimization level 2 (there is 0-7 optimization levels)

### [Gifsicle](https://www.lcdf.org/gifsicle/)
- `-O3`: this sets the optimization level to Gifsicle's maximum



## Author
9sako6