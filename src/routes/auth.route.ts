import { Router } from 'express';
import {
    userRegister
} from '../controllers/auth.controller';
const router = Router();
const userValidator = require('../middlewares/userRegiserValidator')

export default (app: Router) => {
    app.use('/auth', router);

    router.post('/register',[userValidator], userRegister);
};