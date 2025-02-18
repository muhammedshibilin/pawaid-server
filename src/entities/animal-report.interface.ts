import { Document,Types } from "mongoose";
import { AnimalStatus } from "../enums/animal-status.enum";

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