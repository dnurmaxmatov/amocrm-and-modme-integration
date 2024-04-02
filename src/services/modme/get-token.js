import fs from "fs";
import path from "path";
import { send_error } from "../error-telegram.js";
import axios from "axios";

export const getModmeToken = async () => {
    try {
        const filePath = path.join(process.cwd(), "private", "token.json");
        let data = fs.readFileSync(filePath, "utf-8", null);
        data = JSON.parse(data);
        return data.access_token;
    } catch (error) {
        send_error(error.message, 'ERROR_WITH_GET_MODME_TOKEN')
    }
};
