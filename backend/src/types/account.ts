export interface Account {
  id: number;
  name: string;
  balance: number;
  createdAt: Date;
}

export interface CreateAccountRequest {
  name: string;
  initialBalance: number;
}

export interface UpdateBalanceRequest {
  amount: number;
} 