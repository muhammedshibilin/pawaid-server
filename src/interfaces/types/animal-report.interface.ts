import { AnimalStatus } from "../../enums/animal-status.enum";
import { Document,Types } from "mongoose";

export interface IAnimalReport extends Document {
  description: string;
  imageUrl: string;
  status:AnimalStatus;
  location: {
    latitude: number;
    longitude: number;
  },
  userId: Types.ObjectId;
  recruiterId?: Types.ObjectId; 
  doctorId?: Types.ObjectId;
  expenses?: number;
}