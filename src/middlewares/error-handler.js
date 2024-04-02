import { send_error } from "../services/error-telegram.js"

export default async (err, req, res, next) => {
    if (err) {
        await send_error(err, 'UNEXPECTED_ERROR')
    }
    next()
}