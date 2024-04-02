import { send_error } from "../error-telegram.js";
import getGroups from "./get-groups.js";
import axios from "axios";

export const findGroupId = async (group) => {
    try {
        const groups = await getGroups();
        let id = null;
        groups.some(function (element) {
            if (element.code == group) {
                id = element.id;
            }
        });

        return id;
    } catch (error) {
        send_error(error.message, "ERROR_WITH_FIND_GROUP_MODME")
    }
};