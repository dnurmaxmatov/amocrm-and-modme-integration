import env from "../../config/env.js";
import { send_error } from "../error-telegram.js";
import { addToGroup } from "./add-to-group.js";
import { backToTrial } from "./back-to-trial.js";
import { getModmeToken } from "./get-token.js";
import axios from "axios";

export const checkExistsInGroup = async (groupId, studentId, added_date) => {
    try {
        const token = await getModmeToken();
        let students = await axios.get(
            `${env.DOMAIN_MODME}/v1/group/${groupId}/students?all=1`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Referer: env.MODME_REFERER,
                },
            }
        );
        let student = students.data.find((el) => el.id == studentId);
        if (!student) {
            await addToGroup(groupId, studentId, added_date);
        } else if (student.status == 6) {
            await backToTrial(studentId, groupId, token);
        }
        return true;
    } catch (error) {
        send_error(error.message, "ERROR_WITH_CHECK_EXISTS_IN_GROUP")
    }
};