import { imagePaths } from "./image/paths.ts";
import { exportStatJson } from "./stat/file_stat_json.ts";

async function export_stat() {
  const [pathsIgnorePattern, exportPath] = Deno.args;
  const pathsIgnoreRegExp = pathsIgnorePattern
    ? new RegExp(pathsIgnorePattern)
    : undefined;

  const allImages = await imagePaths(".", { pathsIgnoreRegExp });
  await exportStatJson(exportPath, allImages);
}

(async () => {
  await export_stat();
})();
