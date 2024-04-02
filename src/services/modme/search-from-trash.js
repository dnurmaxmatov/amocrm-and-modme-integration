import env from "../../config/env.js";
import { send_error } from "../error-telegram.js";
import { arraysAreEqual } from "./get-st-list.js";
import { getModmeToken } from "./get-token.js";
import axios from "axios";


export const searchFromTrash = async (studentData) => {
    try {
        const token = await getModmeToken();
        const nameArray = studentData.name.toUpperCase().split(" ").sort();
        let studentID = null;
        let student = await axios.get(
            `${env.DOMAIN_MODME}/v1/company/${env.COMPANY_ID}/users/trashed?company_id=${env.COMPANY_ID}&per_page=50&name_or_phone=${studentData.phones[0].value}&page=1`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Referer: env.MODME_REFERER,
                },
            }
        );
        if (student.data.data && student.data.pagination) {
            for (let item of student.data.data) {
                let nameArrayItem = item.name.toUpperCase().split(" ").sort();
                if (arraysAreEqual(nameArrayItem, nameArray)) {
                    studentID = item.id;
                    break;
                }
            }
        }

        return studentID;
    } catch (error) {
        send_error(error.message, "ERROR_WITH_SEARCH_FROM_TRASH")
    }
};