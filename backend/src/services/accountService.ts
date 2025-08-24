import { Account, CreateAccountRequest, UpdateBalanceRequest } from '../types/account';

// In-memory storage for testing now
let accounts: Account[] = [];
let nextId = 1;

export class AccountService {
  static getAllAccounts(): Account[] {
    return accounts;
  }

  // Get account by ID
  static getAccountById(id: number): Account | null {
    return accounts.find(account => account.id === id) || null;
  }

  static createAccount(data: CreateAccountRequest): Account {
    const newAccount: Account = {
      id: nextId++,
      name: data.name,
      balance: data.initialBalance,
      createdAt: new Date()
    };
    
    accounts.push(newAccount);
    return newAccount;
  }

  static updateBalance(id: number, data: UpdateBalanceRequest): Account | null {
    const account = accounts.find(acc => acc.id === id);
    if (!account) return null;
    
    account.balance += data.amount;
    return account;
  }

  static deleteAccount(id: number): boolean {
    const index = accounts.findIndex(acc => acc.id === id);
    if (index === -1) return false;
    
    accounts.splice(index, 1);
    return true;
  }
} 