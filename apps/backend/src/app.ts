import express, { Express } from  "express";
import cors from 'cors';
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

dotenv.config()

const app: Express = express()

app.use(express.json())
app.use(cors({
    origin: "*"
}))

app.use(cookieParser())

import taskRoute from "./controllers/task.controller";
import userRoute from "./controllers/user.controller"
import { clerkMiddleware } from "@clerk/express";
import getClerkClient from "./clients/clerk.client";

const publishableKey = process.env.CLERK_PUBLISHABLE_KEY
const secretKey = process.env.CLERK_SECRET_KEY
const jwtKey = process.env.CLERK_JWT_KEY

if (!publishableKey && !secretKey && !jwtKey){
    console.log(`clerk credentials missing.`)
    throw new Error('Server side error')
}
const clerkClient = getClerkClient();

// app.use()

// app.use('/api/v1', (req, res) => { console.log('welcom'); res.json({ message: 'Success'})})

app.use('/api/v1/tasks', clerkMiddleware({ clerkClient }), taskRoute)
app.use('/api/v1/user', clerkMiddleware({ clerkClient }), userRoute)

export {
    app
}