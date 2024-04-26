// const express = require('express')                           // Equivalent to import.
import express from 'express'; 
import Hello from "./hello.js";
import Lab5 from "./Lab5.js";
import CourseRoutes from "./Kanbas/courses/routes.js";
import cors from "cors";                                        // Import cors library.
import ModuleRoutes from './Kanbas/modules/routes.js';
import AssignmentRoutes from './Kanbas/assignments/routes.js';
import mongoose from "mongoose";
import UserRoutes from "./Users/routes.js";
import session from "express-session";
import "dotenv/config";
const app = express();                                          // Create new express instance.
//mongoose.connect("mongodb://127.0.0.1:27017/kanbas");
const CONNECTION_STRING =  'mongodb://127.0.0.1:27017/kanbas'
mongoose.connect(CONNECTION_STRING);
app.use(cors({
    credentials: true,
    origin: [process.env.FRONTEND_URL, "http://localhost:3000"]
}));

const sessionOptions = {
secret: process.env.SESSION_SECRET,
resave: false,
saveUninitialized: false,
};
if (process.env.NODE_ENV !== "development") {
sessionOptions.proxy = true;
sessionOptions.cookie = {
    sameSite: "none",
    secure: true,
    domain: process.env.HTTP_SERVER_DOMAIN,
};
}
app.use(session(sessionOptions));
      
app.use(express.json());    
UserRoutes(app);                                    
ModuleRoutes(app);                                              
CourseRoutes(app);
AssignmentRoutes(app);
Lab5(app);
Hello(app);


app.listen(process.env.PORT || 4000);                           