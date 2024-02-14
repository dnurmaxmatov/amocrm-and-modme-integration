import { Router } from "express";
import { webHook } from "../controllers/webhook.js";

const router=Router()

router.post('/webhook', webHook)


export default router