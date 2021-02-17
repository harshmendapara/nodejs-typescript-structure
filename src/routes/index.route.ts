import { Router } from 'express';
import authRoute from './auth.route';
export default () => {
  const app = Router();
  authRoute(app);
  return app;
};
