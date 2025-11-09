import { type User, type InsertUser, type Conversation, type InsertConversation, type Message } from "@shared/schema";
import { randomUUID } from "crypto";
import bcrypt from "bcrypt";

export interface LoanApplication {
  id: string;
  conversationId: string;
  applicantId: string;
  applicantName: string;
  loanType: string;
  status: string;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
  applicationData: {
    loanAmount: string;
    purpose: string;
    documents: string[];
  };
}

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  createConversation(conversation: InsertConversation): Promise<Conversation>;
  getConversation(id: string): Promise<Conversation | undefined>;
  addMessage(conversationId: string, message: Message): Promise<Conversation | undefined>;
  
  saveLoanApplication(application: LoanApplication): Promise<LoanApplication>;
  getLoanApplication(id: string): Promise<LoanApplication | undefined>;
  getLoanApplications(applicantId: string): Promise<LoanApplication[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private conversations: Map<string, Conversation>;
  private loanApplications: Map<string, LoanApplication>;

  constructor() {
    this.users = new Map();
    this.conversations = new Map();
    this.loanApplications = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    // Check if username already exists
    const existingUser = await this.getUserByUsername(insertUser.username);
    if (existingUser) {
      throw new Error("Username already exists");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(insertUser.password, 10);
    
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id,
      password: hashedPassword,
      phone: insertUser.phone || null,
      address: insertUser.address || null,
      createdAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async verifyPassword(username: string, password: string): Promise<User | null> {
    const user = await this.getUserByUsername(username);
    if (!user) {
      return null;
    }
    
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return null;
    }
    
    return user;
  }

  async createConversation(insertConversation: InsertConversation): Promise<Conversation> {
    const id = randomUUID();
    console.log(`Creating conversation with loanType: "${insertConversation.loanType}"`);
    const conversation: Conversation = {
      ...insertConversation,
      loanType: insertConversation.loanType, // Explicitly set loanType
      applicantName: insertConversation.applicantName ?? null,
      id,
      createdAt: new Date(),
      messages: insertConversation.messages || [],
    };
    console.log(`Created conversation with ID: ${id}, loanType: "${conversation.loanType}"`);
    this.conversations.set(id, conversation);
    return conversation;
  }

  async getConversation(id: string): Promise<Conversation | undefined> {
    const conversation = this.conversations.get(id);
    if (conversation) {
      console.log(`Retrieved conversation ID: ${id}, loanType: "${conversation.loanType}"`);
    } else {
      console.error(`Conversation not found for ID: ${id}`);
    }
    return conversation;
  }

  async addMessage(conversationId: string, message: Message): Promise<Conversation | undefined> {
    const conversation = this.conversations.get(conversationId);
    if (!conversation) {
      console.error(`Conversation not found when adding message: ${conversationId}`);
      return undefined;
    }

    console.log(`Adding message to conversation ID: ${conversationId}`);
    console.log(`Conversation object keys:`, Object.keys(conversation));
    console.log(`Conversation loanType:`, conversation.loanType);
    console.log(`Conversation loanType type:`, typeof conversation.loanType);
    const messages = Array.isArray(conversation.messages) ? conversation.messages : [];
    const updatedConversation: Conversation = {
      id: conversation.id,
      loanType: conversation.loanType, // Explicitly preserve loanType
      applicantName: conversation.applicantName,
      messages: [...messages, message],
      createdAt: conversation.createdAt,
    };
    console.log(`Updated conversation - ID: ${updatedConversation.id}, loanType: "${updatedConversation.loanType}"`);
    this.conversations.set(conversationId, updatedConversation);
    return updatedConversation;
  }

  async saveLoanApplication(application: LoanApplication): Promise<LoanApplication> {
    console.log(`Saving loan application: ${application.id}`);
    this.loanApplications.set(application.id, application);
    return application;
  }

  async getLoanApplication(id: string): Promise<LoanApplication | undefined> {
    return this.loanApplications.get(id);
  }

  async getLoanApplications(applicantId: string): Promise<LoanApplication[]> {
    const applications = Array.from(this.loanApplications.values())
      .filter(app => app.applicantId === applicantId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return applications;
  }
}

export const storage = new MemStorage();
