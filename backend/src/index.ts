import express from 'express';
import type { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import accountRoutes from './routes/accountRoutes';
import { keyVaultService } from './services/keyVaultService';

dotenv.config();

// Debug environment variables
console.log('Environment variables loaded:');
console.log('PORT:', process.env['PORT']);
console.log('KEY_VAULT_URL:', process.env['KEY_VAULT_URL']);
console.log('NODE_ENV:', process.env['NODE_ENV']);

// Environment-specific configuration
const isProduction = process.env['NODE_ENV'] === 'production';
console.log(`Running in ${isProduction ? 'production' : 'development'} mode`);

const app = express();
const PORT = process.env['PORT'] || 3001;

// Middleware
app.use(cors({
  origin: isProduction 
    ? ['https://agreeable-ground-0a49b7b0f.2.azurestaticapps.net', 'https://sbt-web-app-e8cjh7awa2e6gzc8.canadacentral-01.azurewebsites.net']
    : ['http://localhost:3000'],
  credentials: true
}));
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

// Key Vault test route
app.get('/keyvault/test', async (_req: Request, res: Response) => {
  try {
    const jwtSecret = await keyVaultService.getSecret('JWT-SECRET');
    const databaseUrl = await keyVaultService.getSecret('DATABASE-URL');
    const secrets = await keyVaultService.listSecrets();
    
    res.json({
      message: 'Key Vault integration test',
      jwtSecret: jwtSecret ? '***SECRET-LOADED***' : 'Not found',
      databaseUrl: databaseUrl ? '***SECRET-LOADED***' : 'Not found',
      availableSecrets: secrets,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to access Key Vault',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

app.listen(PORT, () => {
  console.log(`Banking API is running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`Account endpoints: http://localhost:${PORT}/accounts`);
}); 