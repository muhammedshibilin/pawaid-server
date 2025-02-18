import mongoose, { Schema, Types} from 'mongoose';
import { AnimalStatus} from '../enums/animal-status.enum';
import { IAnimalReport } from '../entities/animal-report.interface';


const AnimalReportSchema: Schema = new Schema({
  description: { type: String, required: true },
  imageUrl: { type: String, required: true },
  status: {
    type: String,
    enum: Object.values(AnimalStatus),
    default: AnimalStatus.PENDING,
  },
  location: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
  },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true }, 
  recruiterId: {
    type: [Schema.Types.ObjectId],
    ref: 'Recruiter',
    set: (value: Types.ObjectId | Types.ObjectId[]) => {
      if (Array.isArray(value)) {
        return value;
      }
      return [value];
    }
  },doctorId: {
    type: [Schema.Types.ObjectId],
    ref: 'Doctor',
    set: (value: Types.ObjectId | Types.ObjectId[]) => {
      if (Array.isArray(value)) {
        return value;
      }
      return [value];
    }
  },
  expenses: { type: Number, default: 0 },
});

const AnimalReport = mongoose.model<IAnimalReport>('AnimalReport', AnimalReportSchema);

export default AnimalReport;
