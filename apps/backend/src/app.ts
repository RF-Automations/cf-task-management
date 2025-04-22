import express, { Express } from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

dotenv.config();

const app: Express = express();

const CORS_ORIGIN = process.env?.PROD === "true" ? "https://bnstech.online" : "*"

app.use(express.json());
app.use(
  cors({
    origin: CORS_ORIGIN,
  })
);

app.use(cookieParser());

import taskRoute from "./routers/task.router";
import userRoute from "./routers/user.router";
import adminRoute from "./routers/admin.router";
import { clerkMiddleware } from "@clerk/express";
import getClerkClient from "./clients/clerk.client";

const publishableKey = process.env.CLERK_PUBLISHABLE_KEY;
const secretKey = process.env.CLERK_SECRET_KEY;
const jwtKey = process.env.CLERK_JWT_KEY;

if (!publishableKey && !secretKey && !jwtKey) {
  console.log(`clerk credentials missing.`);
  throw new Error("Server side error");
}
const clerkClient = getClerkClient();

// app.use()

// app.use('/api/v1', (_, res) => { console.log('welcome'); res.json({ message: 'Success'})})

app.use("/api/v1/tasks", clerkMiddleware({ clerkClient }), taskRoute);
app.use("/api/v1/user", clerkMiddleware({ clerkClient }), userRoute);

app.use("/api/v1/admin", clerkMiddleware({ clerkClient }), adminRoute);

export { app };
