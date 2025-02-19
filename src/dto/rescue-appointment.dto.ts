import { Types } from "mongoose";

export interface RescueAppointmentDTO {
     id:Types.ObjectId;
        description: string;
        status:string;
        date:Date;
}