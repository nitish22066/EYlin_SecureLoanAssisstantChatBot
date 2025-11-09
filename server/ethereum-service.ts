// Ethereum/Web3 Integration for Blockchain-based Loan Records
import { ethers, Contract, JsonRpcProvider } from "ethers";
import Web3 from "web3";

// Smart contract ABI for loan records (mock)
export const LOAN_CONTRACT_ABI = [
  {
    "inputs": [
      { "name": "_loanId", "type": "string" },
      { "name": "_borrower", "type": "address" },
      { "name": "_amount", "type": "uint256" },
      { "name": "_interestRate", "type": "uint256" },
      { "name": "_tenure", "type": "uint256" }
    ],
    "name": "createLoan",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "name": "_loanId", "type": "string" }],
    "name": "getLoan",
    "outputs": [
      { "name": "borrower", "type": "address" },
      { "name": "amount", "type": "uint256" },
      { "name": "interestRate", "type": "uint256" },
      { "name": "tenure", "type": "uint256" },
      { "name": "status", "type": "uint8" },
      { "name": "createdAt", "type": "uint256" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "name": "_loanId", "type": "string" },
      { "name": "_status", "type": "uint8" }
    ],
    "name": "updateLoanStatus",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "name": "_loanId", "type": "string" },
      { "name": "_paymentAmount", "type": "uint256" }
    ],
    "name": "recordPayment",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

// Loan status enum
export enum LoanStatus {
  PENDING = 0,
  APPROVED = 1,
  REJECTED = 2,
  ACTIVE = 3,
  COMPLETED = 4,
  DEFAULTED = 5
}

// Blockchain configuration
export interface BlockchainConfig {
  rpcUrl: string;
  contractAddress: string;
  privateKey?: string;
  chainId: number;
}

// Default configuration (testnet)
export const DEFAULT_CONFIG: BlockchainConfig = {
  rpcUrl: "https://sepolia.infura.io/v3/YOUR_INFURA_KEY",
  contractAddress: "0x1234567890123456789012345678901234567890", // Mock address
  chainId: 11155111 // Sepolia testnet
};

export class EthereumLoanService {
  private provider: JsonRpcProvider;
  private contract: Contract | null = null;
  private signer: ethers.Signer | null = null;
  private web3: Web3;

  constructor(config: BlockchainConfig = DEFAULT_CONFIG) {
    // Initialize ethers provider
    this.provider = new JsonRpcProvider(config.rpcUrl);
    
    // Initialize Web3
    this.web3 = new Web3(config.rpcUrl);
    
    // Initialize contract
    if (config.contractAddress) {
      this.contract = new Contract(
        config.contractAddress,
        LOAN_CONTRACT_ABI,
        this.provider
      );
    }

    // Initialize signer if private key provided
    if (config.privateKey) {
      this.signer = new ethers.Wallet(config.privateKey, this.provider);
      if (this.contract) {
        this.contract = this.contract.connect(this.signer);
      }
    }

    console.log("Ethereum service initialized");
  }

  // Create loan record on blockchain
  async createLoanRecord(loanData: {
    loanId: string;
    borrowerAddress: string;
    amount: number;
    interestRate: number;
    tenure: number;
  }): Promise<string | null> {
    try {
      if (!this.contract || !this.signer) {
        console.log("Mock: Creating loan record on blockchain", loanData);
        return `mock_tx_${Date.now()}`;
      }

      const tx = await this.contract.createLoan(
        loanData.loanId,
        loanData.borrowerAddress,
        ethers.parseEther(loanData.amount.toString()),
        loanData.interestRate * 100, // Convert to basis points
        loanData.tenure
      );

      await tx.wait();
      console.log("Loan record created on blockchain:", tx.hash);
      return tx.hash;
    } catch (error) {
      console.error("Error creating loan record:", error);
      return null;
    }
  }

  // Get loan record from blockchain
  async getLoanRecord(loanId: string): Promise<any | null> {
    try {
      if (!this.contract) {
        // Mock response for demo
        return {
          borrower: "0x1234567890123456789012345678901234567890",
          amount: ethers.parseEther("700000"),
          interestRate: 1200, // 12% in basis points
          tenure: 60, // months
          status: LoanStatus.PENDING,
          createdAt: Date.now()
        };
      }

      const loanData = await this.contract.getLoan(loanId);
      return {
        borrower: loanData.borrower,
        amount: loanData.amount,
        interestRate: loanData.interestRate,
        tenure: loanData.tenure,
        status: loanData.status,
        createdAt: loanData.createdAt
      };
    } catch (error) {
      console.error("Error fetching loan record:", error);
      return null;
    }
  }

  // Update loan status
  async updateLoanStatus(loanId: string, status: LoanStatus): Promise<string | null> {
    try {
      if (!this.contract || !this.signer) {
        console.log(`Mock: Updating loan ${loanId} status to ${LoanStatus[status]}`);
        return `mock_tx_${Date.now()}`;
      }

      const tx = await this.contract.updateLoanStatus(loanId, status);
      await tx.wait();
      
      console.log("Loan status updated on blockchain:", tx.hash);
      return tx.hash;
    } catch (error) {
      console.error("Error updating loan status:", error);
      return null;
    }
  }

  // Record payment on blockchain
  async recordPayment(loanId: string, paymentAmount: number): Promise<string | null> {
    try {
      if (!this.contract || !this.signer) {
        console.log(`Mock: Recording payment of ${paymentAmount} for loan ${loanId}`);
        return `mock_tx_${Date.now()}`;
      }

      const tx = await this.contract.recordPayment(
        loanId,
        ethers.parseEther(paymentAmount.toString())
      );
      await tx.wait();
      
      console.log("Payment recorded on blockchain:", tx.hash);
      return tx.hash;
    } catch (error) {
      console.error("Error recording payment:", error);
      return null;
    }
  }

  // Get wallet balance
  async getWalletBalance(address: string): Promise<string> {
    try {
      const balance = await this.provider.getBalance(address);
      return ethers.formatEther(balance);
    } catch (error) {
      console.error("Error fetching wallet balance:", error);
      return "0";
    }
  }

  // Generate new wallet
  static generateWallet(): { address: string; privateKey: string; mnemonic: string } {
    const wallet = ethers.Wallet.createRandom();
    return {
      address: wallet.address,
      privateKey: wallet.privateKey,
      mnemonic: wallet.mnemonic?.phrase || ""
    };
  }

  // Validate Ethereum address
  static isValidAddress(address: string): boolean {
    return ethers.isAddress(address);
  }

  // Convert Wei to Ether
  static weiToEther(wei: bigint): string {
    return ethers.formatEther(wei);
  }

  // Convert Ether to Wei
  static etherToWei(ether: string): bigint {
    return ethers.parseEther(ether);
  }
}

// Export singleton instance
export const ethereumService = new EthereumLoanService();

// Utility functions for Web3 integration
export const web3Utils = {
  // Hash data using keccak256
  hashData: (data: string): string => {
    return ethers.keccak256(ethers.toUtf8Bytes(data));
  },

  // Sign message
  signMessage: async (message: string, privateKey: string): Promise<string> => {
    const wallet = new ethers.Wallet(privateKey);
    return await wallet.signMessage(message);
  },

  // Verify signature
  verifySignature: (message: string, signature: string, address: string): boolean => {
    try {
      const recoveredAddress = ethers.verifyMessage(message, signature);
      return recoveredAddress.toLowerCase() === address.toLowerCase();
    } catch (error) {
      console.error("Error verifying signature:", error);
      return false;
    }
  },

  // Generate transaction hash
  generateTxHash: (): string => {
    return ethers.keccak256(ethers.randomBytes(32));
  }
};