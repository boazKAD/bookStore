import express from "express";
import "dotenv/config";
import cors from "cors";
import authRoutes from "./routers/authRoutes.js";
import {connectDB} from "./lib/db.js";
import booksRoutes from "./routers/booksRoutes.js";
import job  from "./lib/cron.js";


const app = express();
app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 4001;

app.use("/api/auth",authRoutes);
app.use("/api/books",booksRoutes);
job.start();


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});