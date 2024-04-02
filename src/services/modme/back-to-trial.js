import env from "../../config/env.js";
import { send_error } from "../error-telegram.js";
import axios from "axios";


export const backToTrial = async (studentId, groupId, token) => {
    try {
        const data = {
            status: 1,
            type: "backToTrial",
            activated_date: "",
        };

        await axios.put(
            `https://api.modme.uz/v1/group/${groupId}/student/${studentId}/1`,
            data,
            {
                headers: {
                    Accept: "application/json, text/plain, */*",
                    "Accept-Language": "en-GB,en-US;q=0.9,en;q=0.8,uz;q=0.7",
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json;charset=UTF-8",
                    Origin: "https://cabinet.owa.uz",
                    Referer: env.MODME_REFERER,
                },
            }
        );
    } catch (error) {
        send_error(error.message, "ERROR_WITH_BACK_TO_TRIAL")
    }
};