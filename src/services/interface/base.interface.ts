import { Types } from 'mongoose';



export interface IBaseService {
  findNearbyEntities<T>(model: any, latitude: number, longitude: number, radius: number): Promise<Types.ObjectId[]>;
}
