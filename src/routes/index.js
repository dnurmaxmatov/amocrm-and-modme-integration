import { Router } from "express";
import { webHook, activate } from "../controllers/webhook.js";

const router=Router()

router.post('/webhook', webHook)
router.post('/activate', activate)


export default router