import { Types } from "mongoose";

export interface RescueAlertDTO {
    id:Types.ObjectId;
    description: string;
    status:string;
    date:Date;
    location: {
        lat: number;
        lng: number;
    };
}
