import { Router } from "express";
import { mountStudentData } from "./services/amocrm/mount-data.js";
import { getStudentList } from "./services/modme/get-st-list.js";
import { searchFromTrash } from "./services/modme/search-from-trash.js";
import { createStudent } from "./services/modme/create-student.js";
import { restoreFromTrash } from "./services/modme/restore-from-trash.js";
import { findGroupId } from "./services/modme/find-group-id.js";
import { checkExistsInGroup } from "./services/modme/check-exists.js";
import { send_error } from "./services/error-telegram.js";
import { activateStudent } from "./services/modme/activate-student.js";


const router = Router()

router.post('/add', async (req, res) => {
    try {
        const studentData = await mountStudentData(req, res)
        if (!studentData) {
            return true;
        }

        let studentId = await getStudentList(studentData)
        if (!studentId) {
            let archivedStId = await searchFromTrash(studentData)

            if (!archivedStId) {
                await createStudent(studentData)
            } else {
                await restoreFromTrash(archivedStId);
            }
        }

        studentId = await getStudentList(studentData);
        let groupId = await findGroupId(studentData.group)
        const exists = await checkExistsInGroup(groupId, studentId, studentData.added_date)
        if (exists) {
            return true
        }
        return false
    } catch (error) {
        send_error(error.message, "ERROR_WITH_ADD_WEBHOOK")
    }
})

router.post('/activate', async (req, res) => {
    try {
        const studentData = await mountStudentData(req, res, 'activate');
        if (!studentData) {
            return true;
        }
        let studentId = await getStudentList(studentData);
        let groupId = await findGroupId(studentData.group);
        const exists = await checkExistsInGroup(
            groupId,
            studentId,
            studentData.added_date
        );
        if (exists) {
            await activateStudent(groupId, studentId, studentData.activated_date)
            return true;
        }
        return false;
    } catch (error) {
        send_error(error.message, "ERROR_WITH_ACTIVATE_HOOK")
    }
})

export default router