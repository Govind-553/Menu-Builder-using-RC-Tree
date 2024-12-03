import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { menuRoutes } from './routes/menuRoutes.js';
import { initializeDatabase } from './config/database.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(process.cwd(), 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'public', 'index.html'));
});

initializeDatabase();

// Routes
app.use('/api/menu', menuRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});