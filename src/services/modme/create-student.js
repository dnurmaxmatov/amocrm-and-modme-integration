import env from "../../config/env.js";
import { send_error } from "../error-telegram.js";
import { getModmeToken } from "./get-token.js";
import axios from "axios";

export const createStudent = async (data) => {
    try {
        const token = await getModmeToken();
        const { DOMAIN_MODME, BRANCH_ID, COMPANY_ID, MODME_REFERER } = env;
        let student = await axios.post(
            `${DOMAIN_MODME}/v1/user`,
            {
                datas: {
                    contacts: [...data.phones.slice(1)],
                },
                phone: `${data.phones[0].value}`,
                name: data.name,
                password: `${data.phones[0].value}`,
                user_type: "student",
                branch: {
                    id: `${BRANCH_ID}`,
                    main: 1,
                },
                branch_id: `${BRANCH_ID}`,
                company_id: COMPANY_ID,
                relation_degree: 100,
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Referer: MODME_REFERER,
                },
            }
        );
        return student.data.id;
    } catch (error) {
        send_error(error.message, "ERROR_WITH_CREATE_STUDENT")
    }
};