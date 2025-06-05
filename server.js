import express from "express";
import 'dotenv/config'
import connectDB from "./config/mongodb.js";
import chapterRoutes from './routes/chapterRoutes.js';
import limiter from "./middleware/rateLimiter.js";

const app = express();
const port = process.env.PORT || 4000;
connectDB();
app.use(limiter)
app.use(express.json());
app.use("/api/v1",chapterRoutes)
app.get("/",(req,res)=>{
    res.send("API Working");
})
app.listen(port);
