import { getTokens } from "./get-tokens.js";
import axios from "axios";
import environments from "../config/environments.js";

export const tokenIsActive = async (amo_access) => {
  let ok;
  try {
    await axios.get(`${environments.DOMAIN}/api/v4/leads`, {
      headers: {
        Authorization: `Bearer ${amo_access}i`,
      },
    });

    ok = true;
  } catch (error) {
    ok =
      error.response.status == 401 || error.response.status == 403
        ? false
        : true;
  }

  return ok;
};
