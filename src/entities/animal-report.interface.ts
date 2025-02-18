import { Document,Types } from "mongoose";
import { AnimalStatus } from "../enums/animal-status.enum";

export interface IAnimalReport extends Document {
  _id: Types.ObjectId;
  description: string;
  imageUrl: string;
  status:AnimalStatus;
  location: {
    latitude: number;
    longitude: number;
  },
  userId: Types.ObjectId;
  recruiterId?: Types.ObjectId|Types.ObjectId[]; 
  doctorId?: Types.ObjectId|Types.ObjectId[];
  expenses?: number;
} 