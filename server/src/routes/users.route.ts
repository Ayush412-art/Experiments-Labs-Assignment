import  {Router} from 'express'
import { user_login , user_signup } from '../controllers/User.controller'

const router = Router();

router.post("/login" , user_login);


router.post("/signup" , user_signup);

export default router;