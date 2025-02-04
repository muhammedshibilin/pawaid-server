import mongoose, { Schema} from 'mongoose';
import { AnimalStatus} from '../enums/animal-status.enum';
import { IAnimalReport } from '../interfaces/types/animal-report.interface';


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
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // User who reported the animal
  recruiterId: { type: Schema.Types.ObjectId, ref: 'Recruiter' }, // Assigned recruiter (optional)
  doctorId: { type: Schema.Types.ObjectId, ref: 'Doctor' }, // Assigned doctor (optional)
  expenses: { type: Number, default: 0 },
});

const AnimalReport = mongoose.model<IAnimalReport>('AnimalReport', AnimalReportSchema);

export default AnimalReport;
