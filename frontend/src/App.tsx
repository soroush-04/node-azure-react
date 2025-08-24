import React, { useState, useEffect } from 'react';
import './App.css';
import { Account } from './types/account';
import { api } from './services/api';

function App() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [name, setName] = useState('');
  const [balance, setBalance] = useState('');
  
  // Loading states
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState<number | null>(null);
  const [deleting, setDeleting] = useState<number | null>(null);
  
  // Error states
  const [error, setError] = useState('');
  const [formError, setFormError] = useState('');
  
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState('');
  const [editBalance, setEditBalance] = useState('');
  
  const [updateAmount, setUpdateAmount] = useState('');
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  // Clear errors after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  useEffect(() => {
    if (formError) {
      const timer = setTimeout(() => setFormError(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [formError]);

  const loadAccounts = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await api.getAccounts();
      setAccounts(data);
    } catch (err) {
      setError('Failed to load accounts. Please try again.');
      console.error('Error loading accounts:', err);
    } finally {
      setLoading(false);
    }
  };

  const createAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // form validation
    if (!name.trim()) {
      setFormError('Account name is required');
      return;
    }
    
    if (!balance || isNaN(Number(balance))) {
      setFormError('Valid balance is required');
      return;
    }
    
    try {
      setCreating(true);
      setFormError('');
      await api.createAccount({ name: name.trim(), initialBalance: Number(balance) });
      setName('');
      setBalance('');
      loadAccounts();
    } catch (err) {
      setFormError('Failed to create account. Please try again.');
      console.error('Error creating account:', err);
    } finally {
      setCreating(false);
    }
  };

  // Editing functionality
  const startEdit = (account: Account) => {
    setEditingId(account.id);
    setEditName(account.name);
    setEditBalance(account.balance.toString());
  };

  const saveEdit = async () => {
    if (!editingId) return;
    
    // Validation
    if (!editName.trim()) {
      setFormError('Account name is required');
      return;
    }
    
    if (!editBalance || isNaN(Number(editBalance))) {
      setFormError('Valid balance is required');
      return;
    }
    
    try {
      setUpdating(editingId);
      setFormError('');
      await api.updateAccount(editingId, { name: editName.trim(), balance: Number(editBalance) });
      setEditingId(null);
      setEditName('');
      setEditBalance('');
      loadAccounts();
    } catch (err) {
      setFormError('Failed to update account. Please try again.');
      console.error('Error updating account:', err);
    } finally {
      setUpdating(null);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName('');
    setEditBalance('');
    setFormError('');
  };

  const updateBalance = async (id: number) => {
    if (!updateAmount || isNaN(Number(updateAmount))) {
      setFormError('Valid amount is required');
      return;
    }
    
    try {
      setUpdatingId(id);
      setFormError('');
      await api.updateBalance(id, { amount: Number(updateAmount) });
      setUpdateAmount('');
      setUpdatingId(null);
      loadAccounts();
    } catch (err) {
      setFormError('Failed to update balance. Please try again.');
      console.error('Error updating balance:', err);
    } finally {
      setUpdatingId(null);
    }
  };

  const deleteAccount = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this account?')) {
      try {
        setDeleting(id);
        setError('');
        await api.deleteAccount(id);
        loadAccounts();
      } catch (err) {
        setError('Failed to delete account. Please try again.');
        console.error('Error deleting account:', err);
      } finally {
        setDeleting(null);
      }
    }
  };

  // load on mount
  useEffect(() => {
    loadAccounts();
  }, []);

  return (
    <div className="App">
      <h1>Banking App</h1>
      
      {/* Error Messages */}
      {error && <div className="error-message">{error}</div>}
      {formError && <div className="error-message">{formError}</div>}
      
      {/* Create Account */}
      <form onSubmit={createAccount}>
        <h2>Create New Account</h2>
        <input
          type="text"
          placeholder="Account Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={creating}
        />
        <input
          type="number"
          placeholder="Initial Balance"
          value={balance}
          onChange={(e) => setBalance(e.target.value)}
          disabled={creating}
        />
        <button type="submit" disabled={creating}>
          {creating ? 'Creating...' : 'Create Account'}
        </button>
      </form>

      {/* Accounts List */}
      <div>
        <h2>Accounts</h2>
        {loading ? (
          <div className="loading">Loading accounts...</div>
        ) : accounts.length === 0 ? (
          <div className="no-accounts">No accounts found. Create your first account above!</div>
        ) : (
          accounts.map(account => (
            <div key={account.id} className="account-item">
              {editingId === account.id ? (
                // Edit mode
                <div>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    disabled={updating === account.id}
                  />
                  <input
                    type="number"
                    value={editBalance}
                    onChange={(e) => setEditBalance(e.target.value)}
                    disabled={updating === account.id}
                  />
                  <button onClick={saveEdit} disabled={updating === account.id}>
                    {updating === account.id ? 'Saving...' : 'Save'}
                  </button>
                  <button onClick={cancelEdit} disabled={updating === account.id}>
                    Cancel
                  </button>
                </div>
              ) : (
                // Display mode
                <div>
                  <h3>{account.name}</h3>
                  <p>Balance: ${account.balance}</p>
                  <p>ID: {account.id}</p>
                  <button 
                    onClick={() => startEdit(account)}
                    disabled={deleting === account.id || updatingId === account.id}
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => deleteAccount(account.id)}
                    disabled={deleting === account.id || updatingId === account.id}
                  >
                    {deleting === account.id ? 'Deleting...' : 'Delete'}
                  </button>
                  
                  {/* Update Balance */}
                  {updatingId === account.id ? (
                    <div>
                      <input
                        type="number"
                        placeholder="+/- Amount"
                        value={updateAmount}
                        onChange={(e) => setUpdateAmount(e.target.value)}
                      />
                      <button onClick={() => updateBalance(account.id)}>
                        Update Balance
                      </button>
                      <button onClick={() => setUpdatingId(null)}>
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button 
                      onClick={() => setUpdatingId(account.id)}
                      disabled={deleting === account.id}
                    >
                      Update Balance
                    </button>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default App;
