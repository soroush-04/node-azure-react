import React, { useState, useEffect } from 'react';
import './App.css';
import { Account } from './types/account';
import { api } from './services/api';

function App() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [name, setName] = useState('');
  const [balance, setBalance] = useState('');

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

  useEffect(() => {
    loadAccounts();
  }, []);

  return (
    <div className="App">
      <h1>Banking App</h1>
      
      {/* Create Account */}
      <form onSubmit={createAccount}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="number"
          placeholder="Balance"
          value={balance}
          onChange={(e) => setBalance(e.target.value)}
        />
        <button type="submit">Create Account</button>
      </form>

      {/* Accounts List */}
      <div>
        <h2>Accounts</h2>
        {accounts.map(account => (
          <div key={account.id} style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}>
            <h3>{account.name}</h3>
            <p>Balance: ${account.balance}</p>
            <p>ID: {account.id}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
