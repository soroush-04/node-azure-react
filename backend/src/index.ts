import express from 'express';
import type { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import accountRoutes from './routes/accountRoutes';

dotenv.config();

const app = express();
const PORT = process.env['PORT'] || 3001;

// Middleware
app.use(cors());
app.use(express.json());

app.get('/', (_req: Request, res: Response) => {
  res.json({ 
    message: 'Banking API is running!',
    timestamp: new Date().toISOString(),
    endpoints: {
      health: 'GET /health',
      accounts: 'GET /accounts',
      createAccount: 'POST /accounts',
      getAccount: 'GET /accounts/:id',
      updateBalance: 'PUT /accounts/:id/balance',
      deleteAccount: 'DELETE /accounts/:id'
    }
  });
});

// Health check route
app.get('/health', (_req: Request, res: Response) => {
  res.json({ 
    status: 'OK',
    service: 'Banking API',
    version: '1.0.0'
  });
});

app.use('/accounts', accountRoutes);

app.listen(PORT, () => {
  console.log(`Banking API is running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`Account endpoints: http://localhost:${PORT}/accounts`);
}); 