import { Router } from 'express';
import { AccountController } from '../controllers/accountController';

const router = Router();

// GET /accounts - Get all accounts
router.get('/', AccountController.getAllAccounts);

// GET /accounts/:id - Get account by ID
router.get('/:id', AccountController.getAccountById);

// POST /accounts - Create new account
router.post('/', AccountController.createAccount);

// PUT /accounts/:id/balance - Update account balance
router.put('/:id/balance', AccountController.updateBalance);

// DELETE /accounts/:id - Delete account
router.delete('/:id', AccountController.deleteAccount);

export default router; 