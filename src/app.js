import express from "express";
import morgan from "morgan";
import authRoutes from "./routers/auth.routes.js";
import cookieParser from "cookie-parser";

const app = express();

// Middleware
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.get("/", (req, res) => {
    res.send("Hello World!");
});
app.get('/favicon.ico', (req, res) => res.status(204).end());

// Auth Routes
app.use('/api/auth',authRoutes);
    
export default app;