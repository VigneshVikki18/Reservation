import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { errorMiddleware } from "./middlewares/error.js";
import reservationRouter from "./routes/reservationRoute.js";
import authRouter from "./routes/authRoute.js";
import { dbConnection } from "./database/dbConnection.js";
import reviewRoutes from './routes/reviewRoutes.js';
 import restaurantRoutes from './routes/restaurantRoutes.js';

const app = express();
dotenv.config();

app.use(
  cors({
    origin: "https://nimble-pavlova-906865.netlify.app",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
// app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
 app.use("/api/v1/restaurant", restaurantRoutes);
app.use("/api/v1/reservation", reservationRouter);
app.use("/api/v1/auth", authRouter);
 app.use('/api/reviews', reviewRoutes);

app.get("/", (req, res, next) => {
  return res.status(200).json({
    success: true,
    message: "HELLO WORLD AGAIN",
  });
});

dbConnection();

app.use(errorMiddleware);

export default app;
