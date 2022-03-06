import type { Stat } from "./file_stat_json.ts";
import { bytesToUnit } from "../image/file_size.ts";

export const statMessage = async (statJsonPath: string) => {
  const stats: Stat = JSON.parse(
    (await Deno.readTextFile(statJsonPath)) || "{}",
  );
  let totalBeforeBytes = 0;
  let totalAfterBytes = 0;

  const headers = [
    `| File name | Before | After | Diff (rate) |`,
    `| --------- | ------ | ----- | ----------- |`,
  ];

  const rows: string[] = [];

  for (const path of Object.keys(stats)) {
    const [beforeBytes, afterBytes] = stats[path].bytes.slice(-2);
    const diffRate = ((beforeBytes - afterBytes) / beforeBytes * 100).toFixed(
      2,
    );

    totalBeforeBytes += beforeBytes;
    totalAfterBytes += afterBytes;

    // deno-fmt-ignore-start
    rows.push(
      `| ${path} | ${bytesToUnit(beforeBytes)} | ${bytesToUnit(afterBytes)} | -${diffRate}% |`,
    );
    // deno-fmt-ignore-end
  }

  const totalDiffRate =
    ((totalBeforeBytes - totalAfterBytes) / totalBeforeBytes * 100).toFixed(
      2,
    );

  // deno-fmt-ignore-start
  const footers = [
    "| | | | |",
    `| Total | ${bytesToUnit(totalBeforeBytes)} | ${bytesToUnit(totalAfterBytes)} | -${totalDiffRate}% |`,
  ];
  // deno-fmt-ignore-end

  const message = [
    ...headers,
    ...rows,
    ...footers,
  ].join("\n");

  return message;
};
