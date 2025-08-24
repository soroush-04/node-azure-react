import axios from 'axios';
import { Account, CreateAccountRequest, UpdateBalanceRequest } from '../types/account';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

// api calls
export const api = {
  getAccounts: async (): Promise<Account[]> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/accounts`);
      return response.data.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNREFUSED') {
          throw new Error('Cannot connect to server. Please check if the backend is running.');
        }
        if (error.response?.status === 500) {
          throw new Error('Server error. Please try again later.');
        }
      }
      throw new Error('Failed to fetch accounts. Please try again.');
    }
  },

  getAccount: async (id: number): Promise<Account> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/accounts/${id}`);
      return response.data.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          throw new Error('Account not found.');
        }
      }
      throw new Error('Failed to fetch account. Please try again.');
    }
  },

  createAccount: async (data: CreateAccountRequest): Promise<Account> => {
    try {
      const response = await axios.post(`${API_BASE_URL}/accounts`, data);
      return response.data.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 400) {
          throw new Error('Invalid account data. Please check your input.');
        }
      }
      throw new Error('Failed to create account. Please try again.');
    }
  },

  updateAccount: async (id: number, data: { name: string; balance: number }): Promise<Account> => {
    try {
      const response = await axios.put(`${API_BASE_URL}/accounts/${id}`, data);
      return response.data.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          throw new Error('Account not found.');
        }
        if (error.response?.status === 400) {
          throw new Error('Invalid account data. Please check your input.');
        }
      }
      throw new Error('Failed to update account. Please try again.');
    }
  },

  // update balance only
  updateBalance: async (id: number, data: UpdateBalanceRequest): Promise<Account> => {
    try {
      const response = await axios.put(`${API_BASE_URL}/accounts/${id}/balance`, data);
      return response.data.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          throw new Error('Account not found.');
        }
        if (error.response?.status === 400) {
          throw new Error('Invalid amount. Please check your input.');
        }
      }
      throw new Error('Failed to update balance. Please try again.');
    }
  },

  deleteAccount: async (id: number): Promise<void> => {
    try {
      await axios.delete(`${API_BASE_URL}/accounts/${id}`);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          throw new Error('Account not found.');
        }
      }
      throw new Error('Failed to delete account. Please try again.');
    }
  }
}; 