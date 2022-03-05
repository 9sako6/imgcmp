import { statMessage } from "./stat/message.ts";

async function show_stat_message() {
  const [exportPath] = Deno.args;
  console.log(await statMessage(exportPath));
}

(async () => {
  await show_stat_message();
})();
