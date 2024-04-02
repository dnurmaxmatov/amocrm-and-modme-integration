import env from "../../config/env.js";
import { send_error } from "../error-telegram.js";
import { getModmeToken } from "./get-token.js";
import axios from "axios";
import mt from 'moment'



export const addToGroup = async (groupId, studentId, added_date) => {
    try {
        const token = await getModmeToken();
        const added_format = mt.unix(added_date).format("YYYY-MM-DD");
        await axios.post(
            `${env.DOMAIN_MODME}/v1/group/${groupId}/students/${studentId}`,
            {
                created_date: added_format,
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Referer: env.MODME_REFERER,
                },
            }
        );
    } catch (error) {
        send_error(error.message, "ERROR_WITH_ADD_TO_GR")
    }
};