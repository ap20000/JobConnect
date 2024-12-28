import MongoStore from 'connect-mongo';
import mongoose from 'mongoose';
import express from 'express';
import session from 'express-session';





const app = express();


export const dbConnect = () => {
  mongoose.set("strictQuery", true);
  mongoose.connect(process.env.MONGODB_URL)
    .then(() => {
      console.log("Database connected");
    })
    .catch((error) => {
      console.error("Database connection error:", error);
    });

  app.use(session({
    secret: 'abhishek', // Replace with a strong secret key
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGODB_URL }), // Use the correct MongoDB connection string
    cookie: { secure: false } // Set to true if using HTTPS
  }));
};
