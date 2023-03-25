import { fileStatistics, readStatJson } from "./file_stat_json.ts";
import { bytesToUnit } from "../image/file_size.ts";

const THRESHOLD = 3.14;
const MAX_MESSAGE_LENGTH = 65536;

export const statMessage = async (statJsonPath: string) => {
  const stats = await readStatJson(statJsonPath);

  const {
    totalBeforeBytes,
    totalAfterBytes,
    totalDiffRate,
  } = fileStatistics(stats);

  const headers = [
    `<tr>
      <th>File name</th>
      <th>Before</th>
      <th>After</th>
      <th>Diff (rate)</th>
    </tr>`,
  ];

  const rows: string[] = [];
  let messageLength: number = 0;

  for (const path of Object.keys(stats)) {
    const [beforeBytes, afterBytes] = stats[path].bytes.slice(-2);
    const diffRate = ((beforeBytes - afterBytes) / beforeBytes * 100).toFixed(
      2,
    );

    if (messageLength > MAX_MESSAGE_LENGTH - 1000) {
      rows.push(
        `<tr>
          <td>...</td>
          <td>...</td>
          <td>...</td>
          <td>...</td>
        </tr>`,
      );
      break;
    }

    rows.push(
      `<tr>
        <td>${path}</td>
        <td>${bytesToUnit(beforeBytes)}</td>
        <td>${bytesToUnit(afterBytes)}</td>
        <td>-${diffRate}%</td>
      </tr>`,
    );

    messageLength += rows[rows.length - 1].length;
  }

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
      <td>-${
      totalDiffRate.toFixed(
        2,
      )
    }%</td>
    </tr>`,
  ];

  const message = `Optimize images (reduced by ${
    totalDiffRate.toFixed(
      2,
    )
  }%)

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

  if (totalDiffRate < THRESHOLD) {
    return "";
  }

  return message;
};
