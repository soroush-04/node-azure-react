import { DefaultAzureCredential } from '@azure/identity';
import { SecretClient } from '@azure/keyvault-secrets';

export class KeyVaultService {
  private client: SecretClient | null = null;
  private vaultUrl: string = '';

  constructor() {
    // Don't initialize here, we'll do it lazily
  }

  private async initialize(): Promise<void> {
    if (this.client) return; // Already initialized

    // Get Key Vault URL from environment variable
    this.vaultUrl = process.env['KEY_VAULT_URL'] || '';
    
    if (!this.vaultUrl) {
      console.warn('KEY_VAULT_URL not set. Key Vault features will be disabled.');
      return;
    }

    try {
      // Use DefaultAzureCredential for authentication
      const credential = new DefaultAzureCredential();
      this.client = new SecretClient(this.vaultUrl, credential);
      console.log('Key Vault client initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Key Vault client:', error);
      this.client = null;
    }
  }

  async getSecret(secretName: string): Promise<string | null> {
    await this.initialize();
    
    try {
      if (!this.client) {
        console.warn('Key Vault client not initialized');
        return null;
      }

      const secret = await this.client.getSecret(secretName);
      return secret.value || null;
    } catch (error) {
      console.error(`Error retrieving secret ${secretName}:`, error);
      return null;
    }
  }

  async setSecret(secretName: string, value: string): Promise<boolean> {
    await this.initialize();
    
    try {
      if (!this.client) {
        console.warn('Key Vault client not initialized');
        return false;
      }

      await this.client.setSecret(secretName, value);
      return true;
    } catch (error) {
      console.error(`Error setting secret ${secretName}:`, error);
      return false;
    }
  }

  async listSecrets(): Promise<string[]> {
    await this.initialize();
    
    try {
      if (!this.client) {
        console.warn('Key Vault client not initialized');
        return [];
      }

      const secrets: string[] = [];
      for await (const secret of this.client.listPropertiesOfSecrets()) {
        secrets.push(secret.name);
      }
      return secrets;
    } catch (error) {
      console.error('Error listing secrets:', error);
      return [];
    }
  }
}

// Export singleton instance
export const keyVaultService = new KeyVaultService(); 