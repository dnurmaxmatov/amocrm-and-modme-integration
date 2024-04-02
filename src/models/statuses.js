import mongoose from "../config/db.js";
const { model, Schema } = mongoose


const StatusSchema = new Schema({
    id: {
        type: Number
    },
    status: {
        type: Number
    }
});

export const StatusModel = new model("statuses", StatusSchema);