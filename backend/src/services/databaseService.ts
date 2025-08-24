import Database from 'better-sqlite3';
import { Account, CreateAccountRequest, UpdateBalanceRequest } from '../types/account';

export class DatabaseService {
  private db: Database.Database;

  constructor() {
    this.db = new Database('banking.db');
    this.initializeDatabase();
  }
    
    // Use raw SQL for now, might switch to ORM later
  private initializeDatabase(): void {
    // Create accounts table if it doesn't exist
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS accounts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        balance REAL NOT NULL DEFAULT 0,
        createdAt TEXT NOT NULL
      )
    `;
    
    this.db.exec(createTableSQL);
    console.log('Database initialized successfully');
  }

  getAllAccounts(): Account[] {
    const stmt = this.db.prepare('SELECT * FROM accounts ORDER BY id');
    const rows = stmt.all() as any[];
    
    return rows.map(row => ({
      id: row.id,
      name: row.name,
      balance: row.balance,
      createdAt: new Date(row.createdAt)
    }));
  }

  getAccountById(id: number): Account | null {
    const stmt = this.db.prepare('SELECT * FROM accounts WHERE id = ?');
    const row = stmt.get(id) as any;
    
    if (!row) return null;
    
    return {
      id: row.id,
      name: row.name,
      balance: row.balance,
      createdAt: new Date(row.createdAt)
    };
  }

  createAccount(data: CreateAccountRequest): Account {
    const stmt = this.db.prepare(
      'INSERT INTO accounts (name, balance, createdAt) VALUES (?, ?, ?)'
    );
    
    const createdAt = new Date().toISOString();
    const result = stmt.run(data.name, data.initialBalance, createdAt);
    
    return {
      id: result.lastInsertRowid as number,
      name: data.name,
      balance: data.initialBalance,
      createdAt: new Date(createdAt)
    };
  }

  updateAccount(id: number, data: { name: string; balance: number }): Account | null {
    const account = this.getAccountById(id);
    if (!account) return null;
    
    const stmt = this.db.prepare('UPDATE accounts SET name = ?, balance = ? WHERE id = ?');
    stmt.run(data.name, data.balance, id);
    
    return {
      ...account,
      name: data.name,
      balance: data.balance
    };
  }

  updateBalance(id: number, data: UpdateBalanceRequest): Account | null {
    const account = this.getAccountById(id);
    if (!account) return null;
    
    const newBalance = account.balance + data.amount;
    
    const stmt = this.db.prepare('UPDATE accounts SET balance = ? WHERE id = ?');
    stmt.run(newBalance, id);
    
    return {
      ...account,
      balance: newBalance
    };
  }

  deleteAccount(id: number): boolean {
    const stmt = this.db.prepare('DELETE FROM accounts WHERE id = ?');
    const result = stmt.run(id);
    
    return result.changes > 0;
  }

  close(): void {
    this.db.close();
  }
} 