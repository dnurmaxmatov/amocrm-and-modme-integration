import environments from "../config/environments.js";
import axios from "axios";
import catchFn from "../utils/catch.js";

export async function modmeTokenGet() {
  try {
    const { MODME_LOGIN, DOMAIN_MODME, MODME_PASS, MODME_REFERER } =
      environments;
    const token_modme = await axios.post(
      `${DOMAIN_MODME}/v1/auth/login`,
      {
        phone: MODME_LOGIN,
        password: MODME_PASS,
        relation_degree: 1,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Referer: MODME_REFERER,
        },
      }
    );
    if (token_modme.status == 200 && token_modme.data) {
      return { ok: true, data: token_modme.data };
    } else {
      return { ok: false, data: null };
    }
  } catch (error) {
    catchFn(error, 'Error with modme token refresh')
  }
}
