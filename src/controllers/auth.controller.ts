import { RequestHandler } from "express";
import UserService from "../services/user.service";

const Logger = require('../config/logger')
const logger = new Logger('app')

export const userRegister: RequestHandler = async (req, res) => {
  const UserSignUpDTO = req.body;
  const userService = new UserService();
  try {
    const data = await userService.userRegister(UserSignUpDTO);
    if (data && data['_id']) {
      res.status(200).json({ token: data });
    } else {
      res.status(409).json(data);
    }
  } catch (err) {
    res.status(500).json(err);
    logger.error(JSON.stringify(err));
  }
};
