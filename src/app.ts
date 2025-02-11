import express from "express";
import adminRoute from "./routes/admin.route";
import cors from 'cors'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import recruiterRoute from "./routes/recruiter.route";
import doctorRoute from "./routes/doctor.route";
import { connectToDb } from "./config/db.config";
import bodyParser from "body-parser";
import animalRoute from "./routes/animal.route";
import userRoute from "./routes/user.route";
import './jobs/cronjob'
import fcmRoute from "./routes/fcm.route";


const app = express();
const PORT = 4040;

connectToDb().catch(console.dir);

const corsOptions = {
  origin: 'http://localhost:4200',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With',
    'enctype'
  ],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  credentials: true,
  maxAge: 86400
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(bodyParser.json())
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('dev'));



app.use("/admin", adminRoute);
app.use("/recruiter",recruiterRoute)
app.use("/doctor",doctorRoute)
app.use("/animal",animalRoute)
app.use('/notification',fcmRoute)
app.use("/", userRoute);


app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

export default app;
