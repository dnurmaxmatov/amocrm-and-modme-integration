import env from "../config/env.js";
import axios from "axios";

export const send_error = async (error, msg) => {
    await axios.post(
        `https://api.telegram.org/bot${env.BOT_TOKEN}/sendMessage`,
        {
            chat_id: env.CHAT_ID,
            text: `*${msg}*\n\n${error}`
        }
    ).catch(e => {
        console.log(e)
    })
}