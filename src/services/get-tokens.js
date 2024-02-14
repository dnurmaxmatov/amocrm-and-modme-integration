import fs from "fs";
import path from "path";
import axios from "axios";
import catchFn from "../utils/catch.js";
import { tokenIsActive } from "./tokenIsActive.js";
import environments from "../config/environments.js";

export const getTokens = async () => {
  try {
    const {LONG_TERM_TOKEN}=environments
    const filePath = path.join(process.cwd(), "src", "config", "tokens.json");
    let data = fs.readFileSync(filePath, "utf-8", null);
    data = JSON.parse(data);
    let token_is_active=await tokenIsActive(data.amo_access)
    if(!token_is_active){
      data.amo_access = LONG_TERM_TOKEN;
    }
    return data;
  } catch (error) {
    catchFn(error, "Error with get tokens")
  }
};
