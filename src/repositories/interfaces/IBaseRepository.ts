import { Types } from "mongoose";


export interface IBaseRepository<T> {
    findByEmail(email: string): Promise<T | null>;
    findById(id: number): Promise<T | null>;
    findNearby(latitude: number, longitude: number, radius: number): Promise<T[]>

  }
  