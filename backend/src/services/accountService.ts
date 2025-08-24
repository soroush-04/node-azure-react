import { Account, CreateAccountRequest, UpdateBalanceRequest } from '../types/account';
import { DatabaseService } from './databaseService';

// Create a single database instance
const databaseService = new DatabaseService();

export class AccountService {
  static getAllAccounts(): Account[] {
    return databaseService.getAllAccounts();
  }

  static getAccountById(id: number): Account | null {
    return databaseService.getAccountById(id);
  }

  static createAccount(data: CreateAccountRequest): Account {
    return databaseService.createAccount(data);
  }

  static updateAccount(id: number, data: { name: string; balance: number }): Account | null {
    return databaseService.updateAccount(id, data);
  }

  static updateBalance(id: number, data: UpdateBalanceRequest): Account | null {
    return databaseService.updateBalance(id, data);
  }

  static deleteAccount(id: number): boolean {
    return databaseService.deleteAccount(id);
  }
} 