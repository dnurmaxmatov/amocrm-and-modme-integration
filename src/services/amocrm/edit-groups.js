import { send_error } from "../error-telegram.js";
import env from "../../config/env.js";
import axios from 'axios'

export default async function editGroupsAmocrm(enums, id) {
    try {
        const { DOMAIN, LONG_TERM_TOKEN } = env;

        await axios.patch(
            `${DOMAIN}/api/v4/leads/custom_fields/${id}`,
            {
                enums,
            },
            {
                headers: {
                    Authorization: `Bearer ${LONG_TERM_TOKEN}`,
                    "Content-Type": "application/json",
                },
            }
        );
    } catch (error) {
        send_error(error.message, 'ERROR_WITH_EDIT_AMOCRM_GROUPS')
    };
}