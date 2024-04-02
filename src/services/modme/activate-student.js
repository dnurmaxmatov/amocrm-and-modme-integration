import env from "../../config/env.js";
import { send_error } from "../error-telegram.js";
import { getModmeToken } from "./get-token.js";
import axios from "axios";
import mt from 'moment'

export const activateStudent = async (groupId, studentId, activated_date) => {
    try {
        const token = await getModmeToken();
        const activated_format = mt.unix(activated_date).format("YYYY-MM-DD");
        await axios.put(
            `${env.DOMAIN_MODME}/v1/group/${groupId}/student/${studentId}/5`,
            {
                status: 5,
                type: "activation",
                activated_date: activated_format,
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Referer: env.MODME_REFERER,
                },
            }
        );
    } catch (error) {
        send_error(error.message, "ERROR_WITH_ACTIVATE_STUDENT")
    }
};