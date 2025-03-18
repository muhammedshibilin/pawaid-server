import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";
import { corsOptions } from "./config/cors.config";
import adminRoute from "./routes/admin.route";
import recruiterRoute from "./routes/recruiter.route";
import doctorRoute from "./routes/doctor.route";
import animalRoute from "./routes/animal.route";
import userRoute from "./routes/user.route";
import fcmRoute from "./routes/fcm.route";
import s3Route from "./routes/s3.route";

const app = express();

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan(":method :url :status :res[content-length] - :response-time ms"));

app.use("/admin", adminRoute);
app.use("/recruiter", recruiterRoute);
app.use("/doctor", doctorRoute);
app.use("/animal", animalRoute);
app.use("/notification", fcmRoute);
app.use("/s3", s3Route);
app.use("/", userRoute);

export default app;