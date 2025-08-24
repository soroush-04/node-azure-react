import { Router } from 'express';
import { AccountController } from '../controllers/accountController';

const router = Router();

router.get('/', AccountController.getAllAccounts);

router.get('/:id', AccountController.getAccountById);

router.post('/', AccountController.createAccount);

router.put('/:id', AccountController.updateAccount);

router.put('/:id/balance', AccountController.updateBalance);

router.delete('/:id', AccountController.deleteAccount);

export default router; 