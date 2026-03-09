import { configDotenv } from 'dotenv';
import express, { Request, Response } from 'express'
import morgan from 'morgan'
import dotenv from 'dotenv'
import mongoUri from './config/connectDB.js';
import mongoose from 'mongoose'
import { S3Client } from '@aws-sdk/client-s3'
import userRoutes from './routes/userRoutes.js';

const app = express();

dotenv.config({ path: `${__dirname}/../.env` })

app.get("/server-health", (req: Request, res: Response) => {
    res.status(200).json({
        success: "ok",
        message: "Server is running"
    })
})

const mongoConnectionUri = mongoUri();
mongoose.connect(mongoConnectionUri)
.then(() => {
    console.log("Connected to database")
}).catch((error) => {
    console.error("Error in connecting database")
})

app.use(morgan('dev'));
app.use(express.json());

app.use("/api/v1/users", userRoutes)

const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})
