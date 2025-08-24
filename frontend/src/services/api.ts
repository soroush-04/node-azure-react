import axios from 'axios';
import { Account, CreateAccountRequest, UpdateBalanceRequest } from '../types/account';

const API_BASE_URL = 'http://localhost:3001';

// api calls
export const api = {
  getAccounts: async (): Promise<Account[]> => {
    const response = await axios.get(`${API_BASE_URL}/accounts`);
    return response.data.data;
  },

  getAccount: async (id: number): Promise<Account> => {
    const response = await axios.get(`${API_BASE_URL}/accounts/${id}`);
    return response.data.data;
  },

  createAccount: async (data: CreateAccountRequest): Promise<Account> => {
    const response = await axios.post(`${API_BASE_URL}/accounts`, data);
    return response.data.data;
  },

  updateAccount: async (id: number, data: { name: string; balance: number }): Promise<Account> => {
    const response = await axios.put(`${API_BASE_URL}/accounts/${id}`, data);
    return response.data.data;
  },

  // update balance only
  updateBalance: async (id: number, data: UpdateBalanceRequest): Promise<Account> => {
    const response = await axios.put(`${API_BASE_URL}/accounts/${id}/balance`, data);
    return response.data.data;
  },

  deleteAccount: async (id: number): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/accounts/${id}`);
  }
}; 