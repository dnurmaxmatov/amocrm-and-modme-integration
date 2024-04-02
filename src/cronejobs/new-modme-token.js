import axios from "axios";
import env from "../config/env.js";
import fs from 'fs'
import path from 'path'
import { send_error } from "../services/error-telegram.js";


export default async () => {
    try {
        const { MODME_LOGIN, MODME_PASS, MODME_REFERER, DOMAIN_MODME } = env
        const file_path = path.join(process.cwd(), 'private', 'token.json')
        const dir_path = path.join(process.cwd(), 'private')
        if (!fs.existsSync(dir_path)) {
            fs.mkdirSync(dir_path)
        }
        const token = await axios.post(`${DOMAIN_MODME}/v1/auth/login`,
            {
                phone: MODME_LOGIN,
                password: MODME_PASS,
                relation_degree: 1
            }, {
            headers: {
                'Content-Type': 'application/json',
                Referer: MODME_REFERER
            }
        })
        if (token.status == 200 && token.data) {
            fs.writeFileSync(
                file_path,
                JSON.stringify({
                    exp: Math.floor(Date.now() / 1000) + 21600,
                    access_token: token.data.access_token ?? null
                })
            )
        }
    } catch (error) {
        send_error(error.message, 'ERROR_WITH_REFRESH_MODME_TOKEN')
    }
}