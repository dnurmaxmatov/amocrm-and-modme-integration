import axios from "axios"
import env from "../../config/env.js"
import { send_error } from "../error-telegram.js"


export default async () => {
    try {
        const { DOMAIN, LONG_TERM_TOKEN } = env
        const groups = await axios.get(`${DOMAIN}/api/v4/leads/custom_fields`, {
            headers: {
                Authorization: `Bearer ${LONG_TERM_TOKEN}`,
                "Content-Type": "application/json"
            }
        })

        if (groups.status == 200 && groups.data) {
            const group_custom_filed = groups.data._embedded.custom_fields.find((el) => el.name == 'group')
            return group_custom_filed?.enums ?? []
        }
    } catch (error) {
        send_error(error.message, 'ERROR_WITH_AMOCRM_GET_GROUPS')
    }
}

