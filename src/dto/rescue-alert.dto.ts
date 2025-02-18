import { Types } from "mongoose";

export interface RescueAlertDTO {
    id:Types.ObjectId;
    description: string;
    status:string;
    location: {
        lat: number;
        lng: number;
    };
}
