import type { Stat } from "./file_stat_json.ts";
import { bytesToUnit } from "../image/file_size.ts";

export const statMessage = async (statJsonPath: string) => {
  const stats: Stat = JSON.parse(
    (await Deno.readTextFile(statJsonPath)) || "{}",
  );
  let totalBeforeBytes = 0;
  let totalAfterBytes = 0;

  const headers = [
    `<tr>
      <th>File name</th>
      <th>Before</th>
      <th>After</th>
      <th>Diff (rate)</th>
    </tr>`,
  ];

  const rows: string[] = [];

  for (const path of Object.keys(stats)) {
    const [beforeBytes, afterBytes] = stats[path].bytes.slice(-2);
    const diffRate = ((beforeBytes - afterBytes) / beforeBytes * 100).toFixed(
      2,
    );

    totalBeforeBytes += beforeBytes;
    totalAfterBytes += afterBytes;

    rows.push(
      `<tr>
        <td>${path}</td>
        <td>${bytesToUnit(beforeBytes)}</td>
        <td>${bytesToUnit(afterBytes)}</td>
        <td>-${diffRate}%</td>
      </tr>`,
    );
  }

  const totalDiffRate =
    ((totalBeforeBytes - totalAfterBytes) / totalBeforeBytes * 100).toFixed(
      2,
    );

  const footers = [
    `<tr>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
    </tr>`,
    `<tr>
      <td>Total</td>
      <td>${bytesToUnit(totalBeforeBytes)}</td>
      <td>${bytesToUnit(totalAfterBytes)}</td>
      <td>-${totalDiffRate}%</td>
    </tr>`,
  ];

  const message = `Optimize images (reduced by ${totalDiffRate}%)

  <table>
    ${
    [
      ...headers,
      ...rows,
      ...footers,
    ].join("\n")
  }
  </table>

  This Pull Request is created by GitHub Actions ([9sako6/imgcmp](https://github.com/9sako6/imgcmp)).`;

  return message;
};
