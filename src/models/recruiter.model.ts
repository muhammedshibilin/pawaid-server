import mongoose, { Schema, Model} from "mongoose";
import { IRecruiter } from "../entities/IRecruiter.interface";

const RecruiterSchema: Schema = new Schema<IRecruiter>({
    username: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: Number },
    password: { type: String, minlength: 6 },
    document: { type: String, required: true },
    location: {
        type: {
            type: String,
            enum: ["Point"],
            default: "Point"
        },
        coordinates: {
            type: [Number],
            required: true,
            index: "2dsphere"
        }
    },
    rescued: { type: Number, default: 0 },
    is_available: { type: Boolean, default: true },
    is_verified: { type: Boolean, default: false },
    is_block: { type: Boolean, default: false }
}, { timestamps: true });


const Recruiter: Model<IRecruiter> = mongoose.model<IRecruiter>('Recruiter', RecruiterSchema);

export default Recruiter;
