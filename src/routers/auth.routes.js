import { Router } from "express";
import { authcontroller  ,loginController} from "../controllers/auth.controller.js";

const router = Router();


router.post('/register',authcontroller)
router.post('/login',loginController)

export default router;