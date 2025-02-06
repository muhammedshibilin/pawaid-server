import { Document } from "mongoose";

export interface IRecruiter extends Document{
    username:string;
    email:string;
    phone:number;
    document:Document;
    password?:string|null;
    location:{latitude:string,longitude:string}
    is_block?:boolean;
    is_verified?:boolean;
    rescued?:number;
    is_available?:boolean
}