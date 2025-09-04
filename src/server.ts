import express from "express";
import dotenv from "dotenv";
import connectDB from "./db/db";
import cors from "cors";
import cookieParser from "cookie-parser";
import adminRoute from "./routes/admin.route.ts";
dotenv.config();

const app = express();


const startServer = async () => {
  try {
    await connectDB();
    console.log("Database connected successfully");
  } catch (err) {}
};
const PORT = process.env.PORT || 8000;
app.use(express.json());
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173", 
  credentials: true
}));
app.use(cookieParser());

// Add debug logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

app.use("/admin", adminRoute.router);
// app.post("/accept-team",(req:Request,res:Response)=>{
//   console.log(req.body);
// })
// Add error handling middleware


app.listen(PORT, () => {
  startServer();
  console.log(`Server is running on port ${PORT}`);
});
