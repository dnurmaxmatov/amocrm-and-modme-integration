import { send_error } from "../error-telegram.js";
import { getAmoStudent } from "./get-student.js";

export const mountStudentData = async (req, res, status) => {
    try {
        let studentData = await getAmoStudent(req, res, status);
        if (studentData == null) {
            return null;
        }
        let data = studentData.phones
            .map((item) => {
                if (
                    /^(\+998|998)?(3{2}|7{2}|8{2}|2{2}|5{2}|(9[013-57-9]))\d{7}$/.test(
                        item.value
                    )
                ) {
                    return { value: item.value.slice(-9), name: "phone" };
                }
            })
            .filter((el) => el != undefined);
        studentData.phones = data;
        return studentData
    } catch (error) {
        send_error(error.message, "ERROR_WITH_MOUNT_DATA")
    }
}
