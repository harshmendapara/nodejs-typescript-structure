import * as mongoose from 'mongoose';
import { IUser } from '../interfaces/user.interface';

const Schema = mongoose.Schema;

type UserSchema = mongoose.Document;

const userSchema = new Schema(
  {
    userType: { type: Number },
    password: { type: String },
    firstName: { type: String },
    middleName: { type: String },
    lastName: { type: String },
    email: { type: String, unique: true },
    phone: { type: String },
    address: { type: String },
    city: { type: String },
    state: { type: String },
    country: { type: String },
    postalCode: { type: String },
    isActive: { type: Number, default: 1, enum : [1,2,3,4,5] },
    isDelete: { type: Number, default: 0 }
  },
  {
    timestamps: true
  }
);


export default mongoose.model<UserSchema>('User', userSchema);
