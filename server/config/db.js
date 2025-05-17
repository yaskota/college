import mongoose from 'mongoose'
import { config } from 'dotenv'

const mongoURI="mongodb://localhost:27017/college"

config();

const mongodb=async()=>{
    try {
        await mongoose.connect(process.env.MONGODB_URI)
        console.log("database is connected")
    } catch (error) {
        console.log("error occur in database connection")
    }
}

export default mongodb;