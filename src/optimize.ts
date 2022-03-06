import { imagePaths } from "./image/paths.ts";
import { runCommand } from "./optimizer/run_command.ts";

async function optimize() {
  const [pathsIgnorePattern] = Deno.args;
  const pathsIgnoreRegExp = pathsIgnorePattern
    ? new RegExp(pathsIgnorePattern)
    : undefined;

  const allImages = await imagePaths(".", { pathsIgnoreRegExp });
  const gifImages = allImages.filter((path) => /\.gif$/.test(path));
  const jpegImages = allImages.filter((path) => /\.(jpeg|jpg)$/.test(path));
  const pngImages = allImages.filter((path) => /\.png$/.test(path));
  const svgImages = allImages.filter((path) => /\.svg$/.test(path));
  const webpImages = allImages.filter((path) => /\.webp$/.test(path));

  for (const path of webpImages) {
    await runCommand(["cwebp", path, "-o", path]);
  }

  for (const path of gifImages) {
    await runCommand(["gifsicle", "-b", "-O3", "--colors", "256", path]);
  }

  for (const path of pngImages) {
    await runCommand(["optipng", "-o2", path]);
  }

  for (const path of jpegImages) {
    await runCommand(["jpegoptim", "-m85", path]);
  }

  for (const path of svgImages) {
    await runCommand(["svgo", path]);
  }
}

(async () => {
  await optimize();
})();
