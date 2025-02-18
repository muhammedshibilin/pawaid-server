import { IUser } from "../../entities/IUser";
import { IOtp } from "../../entities/IOtp";

export interface IUserRepository {
    create(user: IUser): Promise<IUser>;
    findUserById(userId: string): Promise<IUser | null>;
    updatePassword(id: string, hashedPassword: string): Promise<IUser | null>;
    saveOtp(userId: string, otp: string): Promise<IOtp>;
    verifyOtp(userId: string, otp: string): Promise<boolean>;
    updateUserVerificationStatus(userId: string, isVerified: boolean): Promise<void>;
    createGoogleUser(user: { email: string; username: string }): Promise<IUser | null>;
    findUserByEmail(email:string):Promise<IUser|null>
    updateUserTokens(userId: string, refreshToken: string): Promise<void>;
}