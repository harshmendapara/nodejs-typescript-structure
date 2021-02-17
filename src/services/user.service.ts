import UserModel from "../models/user.model";
export default class UserService {
    public async userRegister(userData) {
        const isExitUser = await UserModel.findOne({ email: userData.email })
        if (isExitUser) {
            return {
                message: 'Already Exists'
            }
        } else {
            return await UserModel.create(userData);
        }
    }
}