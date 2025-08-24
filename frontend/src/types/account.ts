export interface Account {
  id: number;
  name: string;
  balance: number;
  createdAt: string;
}

export interface CreateAccountRequest {
  name: string;
  initialBalance: number;
}

export interface UpdateBalanceRequest {
  amount: number;
} 