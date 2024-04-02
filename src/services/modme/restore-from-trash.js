import env from "../../config/env.js";
import { send_error } from "../error-telegram.js";
import { getModmeToken } from "./get-token.js";
import axios from "axios";

export const restoreFromTrash = async (studentId) => {
    try {
        const token = await getModmeToken();
        await axios.post(
            `${env.DOMAIN_MODME}/v1/user/restore/multiple?branch_id=${env.BRANCH_ID}&user_ids[]=${studentId}&restore_all=false`,
            null,
            {
                headers: {
                    accept: "application/json, text/plain, */*",
                    "accept-language": "en-GB,en-US;q=0.9,en;q=0.8,uz;q=0.7",
                    authorization: `Bearer ${token}`,
                    "sec-ch-ua":
                        '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
                    "sec-ch-ua-mobile": "?0",
                    "sec-ch-ua-platform": '"Windows"',
                    "sec-fetch-dest": "empty",
                    "sec-fetch-mode": "cors",
                    "sec-fetch-site": "cross-site",
                    Referer: `${env.MODME_REFERER}/archive/list/all`,
                    "Referrer-Policy": "unsafe-url",
                },
            }
        );
        return studentId;
    } catch (error) {
        send_error(error.message, "ERROR_WITH_RESTORE_FROM_TRASH")
    }
};