import environments from "../config/environments.js";
import axios from "axios";
import catchFn from "../utils/catch.js";

export async function amoTokensGet(data) {
  try {
    const { INTEGRATION_ID, CODE, REDIRECT_URL, SECRET } = environments;
    if (data.type == "code") {
      const tokensRefresh = await axios.post(
        `${environments.DOMAIN}/oauth2/access_token`,
        {
          client_id: INTEGRATION_ID,
          client_secret: SECRET,
          grant_type: "authorization_code",
          code: CODE,
          redirect_uri: REDIRECT_URL,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (tokensRefresh.status == 200 && tokensRefresh.data) {
        return { ok: true, data: tokensRefresh.data };
      } else {
        return { ok: false, data: null };
      }
    } else if (data.type == "refresh") {
      const tokensRefresh = await axios.post(
        `${environments.DOMAIN}/oauth2/access_token`,
        {
          client_id: INTEGRATION_ID,
          client_secret: SECRET,
          grant_type: "refresh_token",
          refresh_token: data.token,
          redirect_uri: REDIRECT_URL,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (tokensRefresh.status == 200 && tokensRefresh.data) {
        return { ok: true, data: tokensRefresh.data };
      } else {
        return { ok: false, data: null };
      }
    }
  } catch (error) {
    catchFn(error, 'Error with amocrm token refresh')
  }
}
