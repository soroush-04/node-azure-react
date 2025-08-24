import React, { useState, useEffect } from 'react';
import './App.css';
import { Account } from './types/account';
import { api } from './services/api';

function App() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [name, setName] = useState('');
  const [balance, setBalance] = useState('');
  
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState('');
  const [editBalance, setEditBalance] = useState('');
  
  const [updateAmount, setUpdateAmount] = useState('');
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const loadAccounts = async () => {
    const data = await api.getAccounts();
    setAccounts(data);
  };

  const createAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.createAccount({ name, initialBalance: Number(balance) });
    setName('');
    setBalance('');
    loadAccounts();
  };

  const startEdit = (account: Account) => {
    setEditingId(account.id);
    setEditName(account.name);
    setEditBalance(account.balance.toString());
  };

  const saveEdit = async () => {
    if (editingId) {
      await api.updateAccount(editingId, { name: editName, balance: Number(editBalance) });
      setEditingId(null);
      setEditName('');
      setEditBalance('');
      loadAccounts();
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName('');
    setEditBalance('');
  };

  const updateBalance = async (id: number) => {
    await api.updateBalance(id, { amount: Number(updateAmount) });
    setUpdateAmount('');
    setUpdatingId(null);
    loadAccounts();
  };

  const deleteAccount = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this account?')) {
      await api.deleteAccount(id);
      loadAccounts();
    }
  };

  // load on mount
  useEffect(() => {
    loadAccounts();
  }, []);

  return (
    <div className="App">
      <h1>Banking App</h1>
      
      {/* Create Account */}
      <form onSubmit={createAccount}>
        <h2>Create New Account</h2>
        <input
          type="text"
          placeholder="Account Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="number"
          placeholder="Initial Balance"
          value={balance}
          onChange={(e) => setBalance(e.target.value)}
        />
        <button type="submit">Create Account</button>
      </form>

      {/* Accounts List */}
      <div>
        <h2>Accounts</h2>
        {accounts.map(account => (
          <div key={account.id} className="account-item">
            {editingId === account.id ? (
              // Edit mode
              <div>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                />
                <input
                  type="number"
                  value={editBalance}
                  onChange={(e) => setEditBalance(e.target.value)}
                />
                <button onClick={saveEdit}>Save</button>
                <button onClick={cancelEdit}>Cancel</button>
              </div>
            ) : (
              // Display mode
              <div>
                <h3>{account.name}</h3>
                <p>Balance: ${account.balance}</p>
                <p>ID: {account.id}</p>
                <button onClick={() => startEdit(account)}>Edit</button>
                <button onClick={() => deleteAccount(account.id)}>Delete</button>
                
                {/* Update Balance */}
                {updatingId === account.id ? (
                  <div>
                    <input
                      type="number"
                      placeholder="Amount to add/subtract"
                      value={updateAmount}
                      onChange={(e) => setUpdateAmount(e.target.value)}
                    />
                    <button onClick={() => updateBalance(account.id)}>Update Balance</button>
                    <button onClick={() => setUpdatingId(null)}>Cancel</button>
                  </div>
                ) : (
                  <button onClick={() => setUpdatingId(account.id)}>Update Balance</button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
