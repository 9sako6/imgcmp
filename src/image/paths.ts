import { walk } from "../deps.ts";
import { imageRegExp } from "./regexp.ts";

type imagePathsOptions = { pathsIgnoreRegExp?: RegExp };

/** Lists the image file's paths. */
export const imagePaths = async (
  root: string,
  options: imagePathsOptions = {},
) => {
  const pathsIgnoreRegExp = options.pathsIgnoreRegExp ?? /$^/; // mathces no patterns.
  const paths: string[] = [];

  for await (
    const entry of walk(root, { skip: [/^\.git/, pathsIgnoreRegExp] })
  ) {
    if (imageRegExp.test(entry.path)) {
      paths.push(entry.path);
    }
  }
  return paths;
};
