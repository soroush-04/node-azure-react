import { Request, Response } from 'express';
import { AccountService } from '../services/accountService';
import { CreateAccountRequest, UpdateBalanceRequest } from '../types/account';

export class AccountController {
  static getAllAccounts(_req: Request, res: Response): void {
    try {
      const accounts = AccountService.getAllAccounts();
      res.json({
        success: true,
        data: accounts,
        count: accounts.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch accounts'
      });
    }
  }

  static getAccountById(req: Request, res: Response): void {
    try {
      const id = parseInt(req.params['id'] || '');
      if (isNaN(id)) {
        res.status(400).json({
          success: false,
          message: 'Invalid account ID'
        });
        return;
      }

      const account = AccountService.getAccountById(id);

      if (!account) {
        res.status(404).json({
          success: false,
          message: 'Account not found'
        });
        return;
      }

      res.json({
        success: true,
        data: account
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch account'
      });
    }
  }

  // POST /accounts
  static createAccount(req: Request, res: Response): void {
    try {
      const data: CreateAccountRequest = req.body;

      if (!data.name || typeof data.initialBalance !== 'number') {
        res.status(400).json({
          success: false,
          message: 'Name and initialBalance are required'
        });
        return;
      }

      const newAccount = AccountService.createAccount(data);
      res.status(201).json({
        success: true,
        data: newAccount,
        message: 'Account created successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to create account'
      });
    }
  }

  // PUT /accounts/:id/balance
    static updateAccount(req: Request, res: Response): void {
    try {
      const id = parseInt(req.params['id'] || '');
      if (isNaN(id)) {
        res.status(400).json({
          success: false,
          message: 'Invalid account ID'
        });
        return;
      }

      const { name, balance } = req.body;

      if (!name || typeof balance !== 'number') {
        res.status(400).json({
          success: false,
          message: 'Name and balance are required'
        });
        return;
      }

      const updatedAccount = AccountService.updateAccount(id, { name, balance });

      if (!updatedAccount) {
        res.status(404).json({
          success: false,
          message: 'Account not found'
        });
        return;
      }

      res.json({
        success: true,
        data: updatedAccount,
        message: 'Account updated successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to update account'
      });
    }
  }

  static updateBalance(req: Request, res: Response): void {
    try {
      const id = parseInt(req.params['id'] || '');
      if (isNaN(id)) {
        res.status(400).json({
          success: false,
          message: 'Invalid account ID'
        });
        return;
      }

      const data: UpdateBalanceRequest = req.body;

      if (typeof data.amount !== 'number') {
        res.status(400).json({
          success: false,
          message: 'Amount is required and must be a number'
        });
        return;
      }

      const updatedAccount = AccountService.updateBalance(id, data);

      if (!updatedAccount) {
        res.status(404).json({
          success: false,
          message: 'Account not found'
        });
        return;
      }

      res.json({
        success: true,
        data: updatedAccount,
        message: 'Balance updated successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to update balance'
      });
    }
  }

  // DELETE /accounts/:id
  static deleteAccount(req: Request, res: Response): void {
    try {
      const id = parseInt(req.params['id'] || '');
      if (isNaN(id)) {
        res.status(400).json({
          success: false,
          message: 'Invalid account ID'
        });
        return;
      }

      const deleted = AccountService.deleteAccount(id);

      if (!deleted) {
        res.status(404).json({
          success: false,
          message: 'Account not found'
        });
        return;
      }

      res.json({
        success: true,
        message: 'Account deleted successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to delete account'
      });
    }
  }
} 