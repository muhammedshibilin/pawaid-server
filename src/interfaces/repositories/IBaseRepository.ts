

export interface IBaseRepository<T> {
    findByEmail(email: string): Promise<T | null>;
    findById(id: number): Promise<T | null>;
   
  }
  