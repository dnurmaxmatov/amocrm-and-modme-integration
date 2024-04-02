import env from "../../config/env.js";
import { send_error } from "../error-telegram.js";
import { getModmeToken } from "./get-token.js";
import axios from "axios";


export const getStudentList = async (studentData) => {
    try {
        const token = await getModmeToken();
        const nameArray = studentData.name.toUpperCase().split(" ").sort();
        let studentID = null;
        let student = await axios.get(
            `${env.DOMAIN_MODME}/v1/user?user_type=student&per_page=50&page=1&name_or_phone=${studentData?.phones[0].value}&branch_id=${env.BRANCH_ID}`,
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
        send_error(error.message, "ERROR_WITH_GET_STUDENT_LS")
    }
};


export function arraysAreEqual(arr1, arr2) {
    if (arr1.length !== arr2.length) {
        return false;
    }
    return arr1.every((value, index) => value === arr2[index]);
}