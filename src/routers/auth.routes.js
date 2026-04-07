import { Router } from "express";
import { registerController  ,loginController ,profileController ,refreshTokenController,logoutController,logoutAllController} from "../controllers/auth.controller.js";

const router = Router();


router.post('/register',registerController)
router.post('/login',loginController)
router.get('/profile',profileController)
router.get('/refresh',refreshTokenController)
router.post('/logout',logoutController)
router.post('/logout-all',logoutAllController)
export default router;