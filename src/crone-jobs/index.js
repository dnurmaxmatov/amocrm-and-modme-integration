import { modmeTokenGet } from "./modme-token.js";
import { amoTokensGet } from "./amocrm-token.js";
import fs from 'fs';
import path from "path";
import schedule from 'node-schedule'
import catchFn from "../utils/catch.js";
import { groupsSync } from "./groups-sync.js";


export const saveTokensCron = async () => {
  try {
    const filePath = path.join(process.cwd(), "src", "config", "tokens.json");
    const writeToFile = async (amo_token, modme_token) => {
      if (amo_token?.ok && modme_token?.ok) {
        fs.writeFileSync(
          filePath,
          JSON.stringify({
            exp: Math.floor(Date.now() / 1000) + 21600,
            modme_token: modme_token.data.access_token,
            amo_access: amo_token.data.access_token,
            amo_refresh: amo_token.data.refresh_token,
          }),
          "utf-8"
        );
      }
    };
    if (!fs.existsSync(filePath)) {
      const modme_token = await modmeTokenGet();
      const amo_token = await amoTokensGet({ type: "code" });
      await writeToFile(amo_token, modme_token);
    } else {
      const modme_token = await modmeTokenGet();
      const { amo_refresh } = JSON.parse(
        fs.readFileSync(filePath, "utf-8", null)
      );
      const amo_token = await amoTokensGet({
        type: "refresh",
        token: amo_refresh,
      });
      await writeToFile(amo_token, modme_token);
    }
    process.token_sy=true
  } catch (error) {
    catchFn(error, 'Error with save tokens cron')
  }
};

schedule.scheduleJob("*/10 * * * *", async () => {
  saveTokensCron();
});

schedule.scheduleJob("5 20 * * *", async () => {
  saveTokensCron();
});

schedule.scheduleJob("5 4 * * *", async () => {
  saveTokensCron();
});

schedule.scheduleJob("0-59/10 * * * *", async () => {
  groupsSync();
});




if(!process.token_sy){
  saveTokensCron();
}

if (!process.gr_sy) {
  groupsSync();
}



