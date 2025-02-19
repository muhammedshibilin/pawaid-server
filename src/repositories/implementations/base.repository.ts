import mongoose, { Types } from "mongoose";
import { IBaseRepository } from "../interfaces/IBaseRepository";

export class BaseRepository<T> implements IBaseRepository<T> {
  private readonly model: mongoose.Model<T>;

  constructor(model: mongoose.Model<T>) {
    this.model = model;
  }

  async findByEmail(email: string): Promise<T | null> {
    return this.model.findOne({ email }).exec();
  }

  async findById(id:number): Promise<T | null> {
    return this.model.findById(id).exec();
  }

  async findNearby(latitude: number, longitude: number, radius: number): Promise<T[]> {
    try {
      const results = await this.model
        .find({
          location: {
            $geoWithin: {
              $centerSphere: [[longitude, latitude], radius / 6378.1], 
            },
          },
          is_available: true, 
        })
        .lean<T[]>() 
        .exec();
  
      return results;
    } catch (error) {
      console.error("Error finding nearby entities:", error);
      return [];
    }
  }
  

  async updateLocation(id: string, latitude: number, longitude: number): Promise<T | null> {
    try {
      return await this.model.findByIdAndUpdate(
        id,
        {
          location: {
            type: 'Point',
            coordinates: [longitude, latitude],
          },
        },
        { new: true }
      ).exec();
    } catch (error) {
      console.error("Error updating location:", error);
      return null;
    }
  }

 
}
