import express from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/authRoutes.js';
import { dbConnect } from './mongo/dbConnection.js';

import session from 'express-session';

// Corrected line
// Assuming you have a User model

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
dotenv.config();

const corsOptions = {
  origin: "http://localhost:5173", // Allow this specific origin
  credentials: true,              // Allow cookies and credentials
};
app.use(cors(corsOptions));

app.use(express.json());
app.use(morgan('combined'));

// Serve static files

app.use(express.static(path.join(__dirname, "/uploads")));


app.use(session({
  secret: 'abhishek@2024',
  resave: false,
  saveUninitialized: false,
  // store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }), // Use your MongoDB URI
  
}));

// Routes
app.use('/user', authRoutes);

// Serve index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'register.html'));
});

// Database connection
dbConnect();

// Start the server
app.listen(process.env.PORT, () => {
  console.log(`Server Connected Successfully on PORT ${process.env.PORT}`);
});
