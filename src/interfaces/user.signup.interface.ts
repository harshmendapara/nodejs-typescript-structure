export interface IUserSignup {
    email: string;
    password: string;
    type: string;
    firstName?: string;
    lastName?: string;
    middleName?: string;
    phone?: string;
    otp: number
}