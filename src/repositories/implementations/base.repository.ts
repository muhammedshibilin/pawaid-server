import mongoose from "mongoose";
import { IBaseRepository } from "../../interfaces/repositories/IBaseRepository";

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

 
}
