# imgcmp
This [GitHub action](https://github.com/features/actions) optimizes images in your repository.
After your `git push`, you will receive a pull request with optimized images.


## Optimization tools
This bot uses these optimizers.

### [jpegoptim](https://github.com/tjko/jpegoptim)
- `-m85`: this will store the image with 85% quality

### [OptiPNG](http://optipng.sourceforge.net/)
- `-o2`: this set the optimization level 2 (there is 0-7 optimization levels)
