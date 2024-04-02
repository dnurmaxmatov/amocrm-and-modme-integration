import axios from "axios";
import env from "../../config/env.js";
import { send_error } from "../error-telegram.js";
import { getModmeToken } from "./get-token.js";


export default async () => {
    try {
        const { DOMAIN_MODME, BRANCH_ID, MODME_REFERER } = env
        const token = await getModmeToken()

        const groups = await axios.get(
            `${DOMAIN_MODME}/v1/group?branch_id=${BRANCH_ID}&status=2`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Referer: MODME_REFERER,
                }
            }
        );
        return groups.data ?? []
    } catch (error) {
        send_error(error.message, "ERROR_WITH_GET_MODME_GROUPS")
    }
}
